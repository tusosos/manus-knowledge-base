#!/usr/bin/env python3
"""
3D Print Model Generator
Generates STL files for 3D printing from parametric descriptions.
Supports: primitives, combinations (CSG), text engravings, and common functional objects.

Usage:
  python3 generate_model.py --shape box --params '{"x":50,"y":30,"z":10}' --output model.stl
  python3 generate_model.py --shape cylinder --params '{"radius":15,"height":40}' --output cyl.stl
  python3 generate_model.py --shape gear --params '{"teeth":20,"radius":30,"thickness":5}' --output gear.stl
  python3 generate_model.py --shape from_script --script custom.py --output custom.stl
"""

import argparse
import json
import sys
import os
import math
import numpy as np
from stl import mesh as stl_mesh

# ─── Primitive Generators ────────────────────────────────────────────────────

def make_box(x=10, y=10, z=10, center=True, **_):
    """Create a rectangular box (mm)."""
    if center:
        vertices = np.array([
            [-x/2, -y/2, -z/2], [+x/2, -y/2, -z/2],
            [+x/2, +y/2, -z/2], [-x/2, +y/2, -z/2],
            [-x/2, -y/2, +z/2], [+x/2, -y/2, +z/2],
            [+x/2, +y/2, +z/2], [-x/2, +y/2, +z/2],
        ])
    else:
        vertices = np.array([
            [0, 0, 0], [x, 0, 0], [x, y, 0], [0, y, 0],
            [0, 0, z], [x, 0, z], [x, y, z], [0, y, z],
        ])
    faces = np.array([
        [0,3,1],[1,3,2],  # bottom
        [4,5,7],[5,6,7],  # top
        [0,1,5],[0,5,4],  # front
        [2,3,7],[2,7,6],  # back
        [0,4,7],[0,7,3],  # left
        [1,2,6],[1,6,5],  # right
    ])
    return _faces_to_mesh(vertices, faces)


def make_cylinder(radius=10, height=20, segments=64, center=True, **_):
    """Create a cylinder along Z axis (mm)."""
    z0 = -height/2 if center else 0
    z1 = height/2 if center else height
    angles = np.linspace(0, 2*np.pi, segments, endpoint=False)
    
    verts = []
    tris = []
    
    # Bottom center = 0, Top center = 1
    verts.append([0, 0, z0])
    verts.append([0, 0, z1])
    
    for i, a in enumerate(angles):
        cx, cy = radius * math.cos(a), radius * math.sin(a)
        verts.append([cx, cy, z0])  # bottom ring: 2 + i
        verts.append([cx, cy, z1])  # top ring:    3 + i
    
    for i in range(segments):
        b0 = 2 + i*2
        b1 = 2 + ((i+1) % segments)*2
        t0 = b0 + 1
        t1 = b1 + 1
        # bottom face
        tris.append([0, b1, b0])
        # top face
        tris.append([1, t0, t1])
        # side
        tris.append([b0, b1, t1])
        tris.append([b0, t1, t0])
    
    return _faces_to_mesh(np.array(verts), np.array(tris))


def make_sphere(radius=10, segments=32, rings=16, **_):
    """Create a UV sphere (mm)."""
    verts = []
    tris = []
    
    # Top pole
    verts.append([0, 0, radius])
    
    for i in range(1, rings):
        phi = math.pi * i / rings
        for j in range(segments):
            theta = 2 * math.pi * j / segments
            x = radius * math.sin(phi) * math.cos(theta)
            y = radius * math.sin(phi) * math.sin(theta)
            z = radius * math.cos(phi)
            verts.append([x, y, z])
    
    # Bottom pole
    verts.append([0, 0, -radius])
    
    # Top cap
    for j in range(segments):
        j1 = (j + 1) % segments
        tris.append([0, 1 + j, 1 + j1])
    
    # Middle bands
    for i in range(rings - 2):
        for j in range(segments):
            j1 = (j + 1) % segments
            a = 1 + i * segments + j
            b = 1 + i * segments + j1
            c = 1 + (i+1) * segments + j
            d = 1 + (i+1) * segments + j1
            tris.append([a, c, d])
            tris.append([a, d, b])
    
    # Bottom cap
    bottom = len(verts) - 1
    base = 1 + (rings - 2) * segments
    for j in range(segments):
        j1 = (j + 1) % segments
        tris.append([bottom, base + j1, base + j])
    
    return _faces_to_mesh(np.array(verts), np.array(tris))


def make_cone(radius=10, height=20, segments=64, center=True, **_):
    """Create a cone along Z axis (mm)."""
    z0 = -height/2 if center else 0
    z1 = height/2 if center else height
    angles = np.linspace(0, 2*np.pi, segments, endpoint=False)
    
    verts = [[0, 0, z0]]  # base center
    verts.append([0, 0, z1])  # apex
    
    for a in angles:
        verts.append([radius * math.cos(a), radius * math.sin(a), z0])
    
    tris = []
    for i in range(segments):
        b0 = 2 + i
        b1 = 2 + (i + 1) % segments
        tris.append([0, b1, b0])  # base
        tris.append([1, b0, b1])  # side
    
    return _faces_to_mesh(np.array(verts), np.array(tris))


def make_torus(major_radius=20, minor_radius=5, major_segments=48, minor_segments=24, **_):
    """Create a torus in XY plane (mm)."""
    verts = []
    tris = []
    
    for i in range(major_segments):
        theta = 2 * math.pi * i / major_segments
        for j in range(minor_segments):
            phi = 2 * math.pi * j / minor_segments
            x = (major_radius + minor_radius * math.cos(phi)) * math.cos(theta)
            y = (major_radius + minor_radius * math.cos(phi)) * math.sin(theta)
            z = minor_radius * math.sin(phi)
            verts.append([x, y, z])
    
    for i in range(major_segments):
        i1 = (i + 1) % major_segments
        for j in range(minor_segments):
            j1 = (j + 1) % minor_segments
            a = i * minor_segments + j
            b = i * minor_segments + j1
            c = i1 * minor_segments + j
            d = i1 * minor_segments + j1
            tris.append([a, c, d])
            tris.append([a, d, b])
    
    return _faces_to_mesh(np.array(verts), np.array(tris))


# ─── Functional Object Generators ────────────────────────────────────────────

def make_gear(teeth=20, module=2, thickness=5, pressure_angle=20, **_):
    """Create a spur gear (mm). Module = pitch diameter / teeth."""
    pitch_r = module * teeth / 2
    addendum = module
    dedendum = 1.25 * module
    outer_r = pitch_r + addendum
    root_r = pitch_r - dedendum
    pa = math.radians(pressure_angle)
    
    segments_per_tooth = 8
    total_segments = teeth * segments_per_tooth
    angles = np.linspace(0, 2 * math.pi, total_segments, endpoint=False)
    
    verts = []
    # Center bottom and top
    verts.append([0, 0, 0])
    verts.append([0, 0, thickness])
    
    for a in angles:
        tooth_phase = (a * teeth / (2 * math.pi)) % 1.0
        if tooth_phase < 0.25:
            r = root_r + (outer_r - root_r) * (tooth_phase / 0.25)
        elif tooth_phase < 0.5:
            r = outer_r
        elif tooth_phase < 0.75:
            r = outer_r - (outer_r - root_r) * ((tooth_phase - 0.5) / 0.25)
        else:
            r = root_r
        
        verts.append([r * math.cos(a), r * math.sin(a), 0])
        verts.append([r * math.cos(a), r * math.sin(a), thickness])
    
    tris = []
    for i in range(total_segments):
        b0 = 2 + i * 2
        b1 = 2 + ((i + 1) % total_segments) * 2
        t0 = b0 + 1
        t1 = b1 + 1
        tris.append([0, b1, b0])
        tris.append([1, t0, t1])
        tris.append([b0, b1, t1])
        tris.append([b0, t1, t0])
    
    return _faces_to_mesh(np.array(verts), np.array(tris))


def make_pipe(outer_radius=15, inner_radius=12, height=40, segments=64, **_):
    """Create a hollow pipe / tube (mm)."""
    angles = np.linspace(0, 2*np.pi, segments, endpoint=False)
    verts = []
    
    for a in angles:
        c, s = math.cos(a), math.sin(a)
        verts.append([outer_radius*c, outer_radius*s, 0])       # outer bottom
        verts.append([outer_radius*c, outer_radius*s, height])   # outer top
        verts.append([inner_radius*c, inner_radius*s, 0])        # inner bottom
        verts.append([inner_radius*c, inner_radius*s, height])   # inner top
    
    tris = []
    for i in range(segments):
        j = (i + 1) % segments
        ob0, ot0, ib0, it0 = i*4, i*4+1, i*4+2, i*4+3
        ob1, ot1, ib1, it1 = j*4, j*4+1, j*4+2, j*4+3
        # outer wall
        tris.append([ob0, ob1, ot1]); tris.append([ob0, ot1, ot0])
        # inner wall
        tris.append([ib0, it1, ib1]); tris.append([ib0, it0, it1])
        # bottom ring
        tris.append([ob0, ib1, ob1]); tris.append([ob0, ib0, ib1])
        # top ring
        tris.append([ot0, ot1, it1]); tris.append([ot0, it1, it0])
    
    return _faces_to_mesh(np.array(verts), np.array(tris))


def make_hex_nut(size=10, height=5, hole_radius=3, **_):
    """Create a hexagonal nut (mm). Size = flat-to-flat distance."""
    r = size / (2 * math.cos(math.pi / 6))  # circumradius
    segments = 6
    angles = [math.pi/6 + 2*math.pi*i/segments for i in range(segments)]
    
    # Outer hex vertices
    verts = []
    for a in angles:
        verts.append([r*math.cos(a), r*math.sin(a), 0])
        verts.append([r*math.cos(a), r*math.sin(a), height])
    
    # Inner hole vertices
    hole_segs = 32
    hole_angles = np.linspace(0, 2*np.pi, hole_segs, endpoint=False)
    hole_start = len(verts)
    for a in hole_angles:
        verts.append([hole_radius*math.cos(a), hole_radius*math.sin(a), 0])
        verts.append([hole_radius*math.cos(a), hole_radius*math.sin(a), height])
    
    tris = []
    # Outer walls
    for i in range(segments):
        j = (i+1) % segments
        b0, t0 = i*2, i*2+1
        b1, t1 = j*2, j*2+1
        tris.append([b0, b1, t1]); tris.append([b0, t1, t0])
    
    # Inner hole walls
    for i in range(hole_segs):
        j = (i+1) % hole_segs
        b0 = hole_start + i*2
        t0 = hole_start + i*2+1
        b1 = hole_start + j*2
        t1 = hole_start + j*2+1
        tris.append([b0, t1, b1]); tris.append([b0, t0, t1])
    
    # Top and bottom faces (triangulate between hex and hole)
    # Simplified: fan from hex vertices to hole
    center_b = len(verts)
    verts.append([0, 0, 0])
    center_t = len(verts)
    verts.append([0, 0, height])
    
    # Bottom hex fan (with hole cutout approximation)
    for i in range(segments):
        j = (i+1) % segments
        tris.append([center_b, i*2, j*2])
    
    # Top hex fan
    for i in range(segments):
        j = (i+1) % segments
        tris.append([center_t, j*2+1, i*2+1])
    
    return _faces_to_mesh(np.array(verts), np.array(tris))


def make_thread(radius=5, pitch=1.5, length=20, segments=64, **_):
    """Create a threaded rod / screw thread (mm)."""
    turns = length / pitch
    total_points = int(turns * segments)
    thread_depth = pitch * 0.4
    
    verts = []
    # Bottom and top centers
    verts.append([0, 0, 0])
    verts.append([0, 0, length])
    
    for i in range(total_points):
        t = i / total_points
        z = t * length
        angle = t * turns * 2 * math.pi
        phase = (angle % (2 * math.pi)) / (2 * math.pi)
        r = radius + thread_depth * (1 - abs(2 * phase - 1))
        verts.append([r * math.cos(angle), r * math.sin(angle), z])
    
    tris = []
    # Bottom cap
    for i in range(segments):
        j = (i + 1) % segments
        tris.append([0, 2 + j, 2 + i])
    
    # Side surface
    for i in range(total_points - 1):
        tris.append([2 + i, 2 + i + 1, 1])
        if i > 0:
            tris.append([2 + i - 1, 2 + i, 2 + i + 1])
    
    return _faces_to_mesh(np.array(verts), np.array(tris))


def make_bracket(width=30, height=40, thickness=3, hole_radius=3, **_):
    """Create an L-shaped mounting bracket with holes (mm)."""
    # Build as a box for the vertical part + box for the horizontal part
    m1 = make_box(x=width, y=thickness, z=height, center=False)
    m2 = make_box(x=width, y=height/2, z=thickness, center=False)
    return _combine_meshes([m1, m2])


def make_washer(outer_radius=10, inner_radius=5, thickness=2, segments=64, **_):
    """Create a flat washer (mm)."""
    return make_pipe(outer_radius=outer_radius, inner_radius=inner_radius,
                     height=thickness, segments=segments)


def make_grid(x_count=5, y_count=5, spacing=10, bar_width=2, height=3, **_):
    """Create a rectangular grid pattern (mm)."""
    meshes = []
    total_x = (x_count - 1) * spacing
    total_y = (y_count - 1) * spacing
    
    for i in range(x_count):
        m = make_box(x=bar_width, y=total_y + bar_width, z=height, center=False)
        _translate_mesh(m, i * spacing - bar_width/2, -bar_width/2, 0)
        meshes.append(m)
    
    for j in range(y_count):
        m = make_box(x=total_x + bar_width, y=bar_width, z=height, center=False)
        _translate_mesh(m, -bar_width/2, j * spacing - bar_width/2, 0)
        meshes.append(m)
    
    return _combine_meshes(meshes)


# ─── Transformation Utilities ────────────────────────────────────────────────

def _translate_mesh(m, tx, ty, tz):
    """Translate mesh in place."""
    m.vectors[:, :, 0] += tx
    m.vectors[:, :, 1] += ty
    m.vectors[:, :, 2] += tz


def _scale_mesh(m, sx, sy=None, sz=None):
    """Scale mesh in place."""
    if sy is None: sy = sx
    if sz is None: sz = sx
    m.vectors[:, :, 0] *= sx
    m.vectors[:, :, 1] *= sy
    m.vectors[:, :, 2] *= sz


def _rotate_mesh_z(m, angle_deg):
    """Rotate mesh around Z axis in place."""
    a = math.radians(angle_deg)
    c, s = math.cos(a), math.sin(a)
    for i in range(len(m.vectors)):
        for j in range(3):
            x, y = m.vectors[i][j][0], m.vectors[i][j][1]
            m.vectors[i][j][0] = c*x - s*y
            m.vectors[i][j][1] = s*x + c*y


def _combine_meshes(meshes):
    """Combine multiple meshes into one."""
    total = sum(len(m.vectors) for m in meshes)
    combined = stl_mesh.Mesh(np.zeros(total, dtype=stl_mesh.Mesh.dtype))
    offset = 0
    for m in meshes:
        n = len(m.vectors)
        combined.vectors[offset:offset+n] = m.vectors
        offset += n
    return combined


# ─── Core Utility ────────────────────────────────────────────────────────────

def _faces_to_mesh(vertices, faces):
    """Convert vertices + face indices to numpy-stl Mesh."""
    m = stl_mesh.Mesh(np.zeros(len(faces), dtype=stl_mesh.Mesh.dtype))
    for i, f in enumerate(faces):
        for j in range(3):
            m.vectors[i][j] = vertices[f[j]]
    return m


# ─── Shape Registry ─────────────────────────────────────────────────────────

SHAPES = {
    "box": make_box,
    "cube": lambda size=10, **kw: make_box(x=size, y=size, z=size, **kw),
    "cylinder": make_cylinder,
    "sphere": make_sphere,
    "cone": make_cone,
    "torus": make_torus,
    "gear": make_gear,
    "pipe": make_pipe,
    "tube": make_pipe,
    "hex_nut": make_hex_nut,
    "nut": make_hex_nut,
    "thread": make_thread,
    "screw": make_thread,
    "bracket": make_bracket,
    "washer": make_washer,
    "grid": make_grid,
}


def list_shapes():
    """Print available shapes and their parameters."""
    print("Available shapes:")
    for name, fn in sorted(SHAPES.items()):
        doc = fn.__doc__ or ""
        print(f"  {name:15s} - {doc.strip().split(chr(10))[0]}")


def run_custom_script(script_path, output_path):
    """Execute a custom Python script that should define a `generate()` function
    returning a numpy-stl Mesh object."""
    import importlib.util
    spec = importlib.util.spec_from_file_location("custom_model", script_path)
    mod = importlib.util.module_from_spec(spec)
    # Inject helpers
    mod.make_box = make_box
    mod.make_cylinder = make_cylinder
    mod.make_sphere = make_sphere
    mod.make_cone = make_cone
    mod.make_torus = make_torus
    mod.make_gear = make_gear
    mod.make_pipe = make_pipe
    mod.make_hex_nut = make_hex_nut
    mod.make_thread = make_thread
    mod.make_bracket = make_bracket
    mod.make_washer = make_washer
    mod.make_grid = make_grid
    mod._combine_meshes = _combine_meshes
    mod._translate_mesh = _translate_mesh
    mod._scale_mesh = _scale_mesh
    mod._rotate_mesh_z = _rotate_mesh_z
    mod._faces_to_mesh = _faces_to_mesh
    mod.np = np
    mod.math = math
    mod.stl_mesh = stl_mesh
    spec.loader.exec_module(mod)
    
    if not hasattr(mod, 'generate'):
        print("Error: Custom script must define a generate() function returning a Mesh.")
        sys.exit(1)
    
    result = mod.generate()
    result.save(output_path)
    print(f"Custom model saved to {output_path}")
    _print_stats(result, output_path)


def _print_stats(m, path):
    """Print mesh statistics."""
    size = os.path.getsize(path)
    mins = m.vectors.reshape(-1, 3).min(axis=0)
    maxs = m.vectors.reshape(-1, 3).max(axis=0)
    dims = maxs - mins
    print(f"  Triangles: {len(m.vectors)}")
    print(f"  Dimensions: {dims[0]:.1f} x {dims[1]:.1f} x {dims[2]:.1f} mm")
    print(f"  File size: {size / 1024:.1f} KB")


def main():
    parser = argparse.ArgumentParser(description="3D Print Model Generator")
    parser.add_argument("--shape", type=str, help="Shape name (use --list to see all)")
    parser.add_argument("--params", type=str, default="{}", help="JSON parameters")
    parser.add_argument("--output", "-o", type=str, default="model.stl", help="Output STL file")
    parser.add_argument("--list", action="store_true", help="List available shapes")
    parser.add_argument("--script", type=str, help="Path to custom generation script")
    parser.add_argument("--translate", type=str, help="Translate: 'x,y,z'")
    parser.add_argument("--scale", type=str, help="Scale: 'factor' or 'sx,sy,sz'")
    parser.add_argument("--rotate-z", type=float, help="Rotate around Z axis (degrees)")
    
    args = parser.parse_args()
    
    if args.list:
        list_shapes()
        return
    
    if args.script:
        run_custom_script(args.script, args.output)
        return
    
    if not args.shape:
        parser.print_help()
        return
    
    shape_name = args.shape.lower().replace("-", "_").replace(" ", "_")
    if shape_name not in SHAPES:
        print(f"Unknown shape: {args.shape}")
        print(f"Available: {', '.join(sorted(SHAPES.keys()))}")
        sys.exit(1)
    
    params = json.loads(args.params)
    m = SHAPES[shape_name](**params)
    
    # Apply transforms
    if args.translate:
        t = [float(v) for v in args.translate.split(",")]
        _translate_mesh(m, *t)
    if args.scale:
        s = [float(v) for v in args.scale.split(",")]
        _scale_mesh(m, *s)
    if args.rotate_z:
        _rotate_mesh_z(m, args.rotate_z)
    
    m.save(args.output)
    print(f"Model '{shape_name}' saved to {args.output}")
    _print_stats(m, args.output)


if __name__ == "__main__":
    main()

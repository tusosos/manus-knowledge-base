"""
Custom 3D Model Template
========================
Define a generate() function that returns a numpy-stl Mesh object.
All shape functions and utilities are pre-injected:
  make_box, make_cylinder, make_sphere, make_cone, make_torus,
  make_gear, make_pipe, make_hex_nut, make_thread, make_bracket,
  make_washer, make_grid,
  _combine_meshes, _translate_mesh, _scale_mesh, _rotate_mesh_z,
  _faces_to_mesh, np, math, stl_mesh
"""

def generate():
    # Example: A platform with 4 pillars
    base = make_box(x=60, y=60, z=3, center=False)

    pillars = []
    for px, py in [(5, 5), (50, 5), (5, 50), (50, 50)]:
        p = make_cylinder(radius=3, height=25, center=False)
        _translate_mesh(p, px, py, 3)
        pillars.append(p)

    top = make_box(x=60, y=60, z=2, center=False)
    _translate_mesh(top, 0, 0, 28)

    return _combine_meshes([base] + pillars + [top])

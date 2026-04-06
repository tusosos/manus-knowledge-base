#!/usr/bin/env python3
"""
Preview a 3D STL model as a PNG image using matplotlib.

Usage:
  python3 preview_model.py model.stl preview.png
  python3 preview_model.py model.stl preview.png --elevation 30 --azimuth 45
"""

import argparse
import sys
import numpy as np
from stl import mesh as stl_mesh

def render_stl_to_png(stl_path, png_path, elevation=30, azimuth=45, figsize=(8, 8)):
    """Render an STL file to a PNG preview image."""
    try:
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        from mpl_toolkits.mplot3d.art3d import Poly3DCollection
    except ImportError:
        print("Error: matplotlib required. Install with: pip3 install matplotlib")
        sys.exit(1)
    
    m = stl_mesh.Mesh.from_file(stl_path)
    
    fig = plt.figure(figsize=figsize)
    ax = fig.add_subplot(111, projection='3d')
    
    polygons = []
    for v in m.vectors:
        polygons.append(v)
    
    collection = Poly3DCollection(polygons, alpha=0.85, linewidths=0.3)
    collection.set_facecolor('#4A90D9')
    collection.set_edgecolor('#2C5F8A')
    ax.add_collection3d(collection)
    
    all_points = m.vectors.reshape(-1, 3)
    mins = all_points.min(axis=0)
    maxs = all_points.max(axis=0)
    center = (mins + maxs) / 2
    span = (maxs - mins).max() / 2 * 1.2
    
    ax.set_xlim(center[0] - span, center[0] + span)
    ax.set_ylim(center[1] - span, center[1] + span)
    ax.set_zlim(center[2] - span, center[2] + span)
    
    ax.view_init(elev=elevation, azim=azimuth)
    ax.set_xlabel('X (mm)')
    ax.set_ylabel('Y (mm)')
    ax.set_zlabel('Z (mm)')
    
    dims = maxs - mins
    ax.set_title(f'{stl_path}\n{dims[0]:.1f} x {dims[1]:.1f} x {dims[2]:.1f} mm | {len(m.vectors)} triangles',
                 fontsize=10)
    
    plt.tight_layout()
    plt.savefig(png_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"Preview saved to {png_path}")


def main():
    parser = argparse.ArgumentParser(description="Preview STL model as PNG")
    parser.add_argument("stl_file", help="Input STL file")
    parser.add_argument("png_file", help="Output PNG file")
    parser.add_argument("--elevation", type=float, default=30, help="Camera elevation (degrees)")
    parser.add_argument("--azimuth", type=float, default=45, help="Camera azimuth (degrees)")
    parser.add_argument("--figsize", type=int, default=8, help="Figure size (inches)")
    
    args = parser.parse_args()
    render_stl_to_png(args.stl_file, args.png_file, args.elevation, args.azimuth,
                      figsize=(args.figsize, args.figsize))


if __name__ == "__main__":
    main()

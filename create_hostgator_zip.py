import os
import zipfile
import shutil

cwd = os.getcwd()
dist_dir = os.path.join(cwd, 'dist')
public_dir = os.path.join(cwd, 'public')
zip_name = 'conecta-mairipora-hostgator.zip'
root_zip_path = os.path.join(cwd, zip_name)
public_zip_path = os.path.join(public_dir, zip_name)
dist_zip_path = os.path.join(dist_dir, zip_name)

print(f"Creating {zip_name} from {dist_dir} in {cwd}...")

files_added = []
with zipfile.ZipFile(root_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(dist_dir):
        for file in files:
            # Skip any zip or tar file
            if file.endswith('.zip') or file.endswith('.tar.gz'):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, dist_dir)
            zf.write(full_path, arcname=rel_path)
            files_added.append(rel_path)

print(f"Successfully packaged {len(files_added)} files into {root_zip_path}")
zip_size = os.path.getsize(root_zip_path) / (1024 * 1024)
print(f"Zip file size: {zip_size:.2f} MB")

# Also copy to public/ and dist/ so user can download directly via browser
if os.path.exists(public_dir):
    shutil.copy2(root_zip_path, public_zip_path)
    print(f"Copied zip to {public_zip_path}")

if os.path.exists(dist_dir):
    shutil.copy2(root_zip_path, dist_zip_path)
    print(f"Copied zip to {dist_zip_path}")

print("Packaging complete! Ready for HostGator cPanel extraction.")

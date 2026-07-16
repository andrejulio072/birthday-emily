# Photo intake workflow

This folder is the permanent catalogue for every photo Andre sends for the Emily birthday experience.

## What GitHub stores

- Stable photo IDs
- Original upload filenames
- SHA-256 checksums for duplicate detection
- Album and chapter assignment
- Captions and accessible alt text
- Image dimensions and orientation
- Object-position instructions
- Final Supabase Storage paths
- Upload status

## What remains outside GitHub

Original and optimized image binaries stay outside the repository. They will be uploaded later to the dedicated Supabase project and bucket:

```text
birthday-emily
└── emily-birthday-media
    └── photos/
```

This prevents the public Git repository and Vercel build from becoming unnecessarily large while preserving all organization and implementation work in version control.

## Status values

- `prepared`: catalogued, optimized paths assigned, not yet uploaded
- `uploaded`: both 480px and 1280px files are in Supabase Storage
- `live`: URLs verified in the deployed page

## Runtime behavior

The React page always renders the embedded lightweight blur preview first. A photo becomes interactive automatically when its optimized file loads successfully from Supabase. No code change is required after the binary upload.

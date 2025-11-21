# Avatars Folder

Place author avatar images in this folder. The images should be named using the author's `username` (as specified in the MDX frontmatter).

## Supported Formats

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`
- `.svg`

## Naming Convention

Name your avatar files using the author's username. For example:
- `samarth.jpg` for username "samarth"
- `sarah.png` for username "sarah"
- `mike.webp` for username "mike"

## Fallback

If an avatar image is not found for a username, the system will automatically fall back to a generated avatar from DiceBear API using the username as a seed.

## Example

If your MDX file has:
```yaml
authors:
  - name: "John Doe"
    username: "johndoe"
```

Then place the avatar image as:
- `public/avatars/johndoe.jpg` (or `.png`, `.webp`, etc.)


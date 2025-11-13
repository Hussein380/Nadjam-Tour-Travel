# Favicon Setup Guide

I've configured the favicon metadata in your `app/layout.tsx` file. Now you need to add the actual favicon image files to your `public` folder.

## Required Image Files

You need to create the following favicon files and place them in the `public` folder:

1. **favicon.ico** - Traditional favicon (16x16, 32x32, 48x48 sizes in one file)
2. **icon.png** - 32x32 pixels (standard favicon)
3. **icon-192.png** - 192x192 pixels (Android home screen)
4. **icon-512.png** - 512x512 pixels (Android splash screen)
5. **apple-icon.png** - 180x180 pixels (Apple touch icon for iOS)

## How to Create These Files

### Option 1: Using Online Tools (Easiest)
1. Go to a favicon generator like:
   - https://realfavicongenerator.net/
   - https://www.favicon-generator.org/
   - https://favicon.io/

2. Upload your logo image (the red and grey curved shapes logo you described)
3. The tool will generate all the required sizes automatically
4. Download the generated files
5. Place them in your `public` folder

### Option 2: Using Image Editing Software
If you have the original logo file:
1. Open it in an image editor (Photoshop, GIMP, Canva, etc.)
2. Resize to each required size
3. Export as PNG (or ICO for favicon.ico)
4. Save to the `public` folder

### Option 3: Using the Existing Logo
If you want to use your existing `nadjam-logo.png`:
1. You can resize it to create the favicon files
2. Make sure it looks good at small sizes (16x16, 32x32)

## File Structure

After adding the files, your `public` folder should look like:
```
public/
  ├── favicon.ico
  ├── icon.png
  ├── icon-192.png
  ├── icon-512.png
  ├── apple-icon.png
  └── images/
      └── nadjam-logo.png (existing)
```

## Testing

After adding the files:
1. Restart your Next.js development server
2. Check the browser tab - you should see your favicon
3. Test on mobile devices to see the app icons
4. Use Google's Rich Results Test to verify: https://search.google.com/test/rich-results

## For Google Search Results

The favicon will appear in Google search results automatically once:
- The files are properly placed
- Your site is indexed by Google
- The metadata is correctly configured (already done!)

Note: It may take a few days to a few weeks for Google to update the favicon in search results after you deploy the changes.


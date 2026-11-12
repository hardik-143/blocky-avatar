# Blocky Avatar

Blocky avatars and (soon) a multiplayer city, drawn with the plain 2D canvas API. No game engine, no build step.

## Blockling Studio (`studio/`)

An avatar dressing room. Open `studio/index.html` in a browser.

- **Body:** 6 body types, 5 head shapes, skin tones
- **Face:** 12 eye styles, eye color, 6 brow styles, 12 mouths, mouth color, face details (blush, freckles, lashes, bandage, face paint, beauty mark), facial hair
- **Hair:** 15 styles with main and highlight colors
- **Headwear:** 19 hats and 10 glasses styles
- **Clothing:** 13 tops, 11 prints, 7 bottoms, 6 shoe styles, each with two colors
- **Extras:** 14 accessories (backpack, jetpack, cape, wings, tail, balloon and more)
- **Emotes:** 28 looping emotes with face expressions and effects; walk, run and jump previews
- **Outfits:** 12 presets, randomize, 3 save slots, shareable `BL1.` look codes

The look is a small JSON object (see `DEFAULT` and `cleanLook` in the script). The multiplayer game will reuse the same format, so a look made here travels into the city.

### No overlapping blocks

Each piece is placed against the outer surface of what is already there: hats and goggles are sized to wrap the hair under them, headphones and earrings sit outside the hair, hanging hair goes over bands and straps, and the back stacks outward (hood, hair, pack, cape, wings). The head and legs rock on the edge they tip toward instead of sinking, and arms, satchel and balloon are moved out of anything they would cut into.

`node tests/overlap-check.js` checks this: it builds the avatar for about 6,000 look combinations and animation frames and lists any blocks that cut into each other by more than 3 cm.

### How it renders

Every body part, hair piece and accessory is a box on a jointed rig. Each frame the boxes are rotated, projected with a perspective camera, sorted back to front and filled. Faces and clothing prints are painted onto the box faces.

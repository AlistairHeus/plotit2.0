Document Properties
Root ID: fantasyMap

Dimensions: 3840x2160 (Standard 4K UHD resolution)

Base Background: Solid Black (#000000)

1. The Definitions Block (<defs>)
This section does not render anything on its own. It stores reusable assets, filters, and shapes that the rest of the map references to save space and processing power.

Filters (id="filters"): Contains dropShadow05, which applies a subtle blur and offset (used later for things like glaciers or elevation).

Base Shapes (id="deftemp"): * featurePaths: The storage container for all your map's geometric paths (this is where the long d= attributes used to be).

land Mask: Defines which paths are solid landmasses (using white fills) and which are holes or internal seas (using black fills).

water Mask: The exact inverse of the land mask, used to isolate the oceans.

Textures & Masks: * oceanic Pattern: Sets up an image (oceanicPattern) to repeat across the water sections.

vignette-mask: Creates a darkened, blurred border around the edges of the 4K canvas to give it a cinematic or aged look.

Symbols: Defines the reusable map markers: icon-circle (for cities) and icon-anchor (for ports/harbors).

2. The Main Visual Container (<g id="viewbox">)
This is where the actual rendering happens. The layers are stacked from bottom to top; what comes first is drawn at the back.

ocean: The very bottom layer. It features a base solid blue (#00a8f0), stacks several semi-transparent layers for depth, and applies the oceanic pattern over it.

lakes: Uses specific path references (like data-f="5") and fills them with a freshwater blue color.

landmass: A single giant rectangle filled with a sandy/beige color (#e3dfce) that uses the land mask to only show the color where your continents and isles exist.

texture: Overlays an external image file (antique-small.jpg) at 60% opacity to give the entire map a weathered paper feel.

regions: Handles political boundaries.

statesBody: Colors in different territories (e.g., #66c2a5, #fc8d62) and draws their outlines.

borders: Draws the actual political lines on the map. It includes solid black lines for state borders and thinner, faded lines for internal province borders.

ice: Renders glaciers using the previously defined dropShadow05 to give them a slight 3D pop off the landmass.

rivers: A massive collection of paths drawn with a brownish-gold color (#a69b7d) that only renders where land exists.

provs: A dedicated text layer for province names, set to a 10px Georgia font.

coastline: Draws a dark, 1.41px line exactly around the edges of the landmasses and isles to make them pop against the water.

icons: The very top layer, containing your points of interest.

cities: Uses the icon-circle symbol to place yellow settlements (burgs) across the map based on X/Y coordinates.

anchors: Uses the icon-anchor symbol to mark port locations in white.
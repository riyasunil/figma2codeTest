// Function to convert Figma layers to HTML/CSS code
function convertToFigmaCode(layers: readonly SceneNode[]) {
  let html = '';
  let css = '';

  // Recursive function to process layers
  function processLayers(layers: any) {
    for (const layer of layers) {
      if (layer.type === 'TEXT') {
        const { fontName, fontSize, textAlign, characters } = layer;
        const fontFamily = fontName.family;
        const fontWeight = fontName.style.includes('Bold') ? 'bold' : 'normal';

        html += `<div style="font-family: '${fontFamily}', sans-serif; font-weight: ${fontWeight}; font-size: ${fontSize}px; text-align: ${textAlign};">${characters}</div>\n`;
      } else if (layer.type === 'RECTANGLE') {
        const { fills, absoluteBoundingBox } = layer;
        const { width, height } = absoluteBoundingBox;
        const fill = fills[0].color;
        const backgroundColor = `rgba(${fill.r * 255}, ${fill.g * 255}, ${fill.b * 255}, ${fill.a})`;

        css += `background-color: ${backgroundColor};\n`;
        html += `<div style="width: ${width}px; height: ${height}px; ${css}">\n`;
        
        if (layer.children) {
          processLayers(layer.children);
        }

        html += `</div>\n`;
      } else if(layer.type == 'STAR'){
        console.log("star");
      }
    }
  }

  processLayers(layers);

  // Print the generated HTML/CSS code
  console.log('<div>');
  console.log(html);
  console.log('</div>');
  console.log('<style>');
  console.log(css);
  console.log('</style>');
}

// Function to retrieve the selected frame
async function getSelectedFrame() {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.closePlugin('Please select a frame.');
    return;
  }

  const selectedFrame = selection[0];

  if (selectedFrame.type !== 'FRAME') {
    figma.closePlugin('Selected item is not a frame.');
    return;
  }

  return selectedFrame;
}

// Main function to run the plugin
async function runPlugin() {
  const selectedFrame = await getSelectedFrame();

  if (!selectedFrame) {
    return;
  }

  const layers = selectedFrame.children;

  convertToFigmaCode(layers);

  figma.closePlugin();
}

// Run the plugin
runPlugin();



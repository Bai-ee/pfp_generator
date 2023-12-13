"use strict";

// Assuming SceneNode and FrameNode are imported or declared somewhere
// Import or declare these types as needed, depending on your setup

// Function to duplicate the frame multiple times with different visibility settings
function duplicateFrameWithRandomVisibility(numDuplicates: number): void {
  const nodes = figma.currentPage.selection;

  if (nodes.length === 0 || nodes[0].type !== "FRAME") {
    console.log("Please select a frame.");
    return;
  }

  const originalFrame = nodes[0] as FrameNode;

  for (let i = 0; i < numDuplicates; i++) {
    const duplicatedFrame = originalFrame.clone() as FrameNode;
    duplicatedFrame.x = originalFrame.x + (i + 1) * (originalFrame.width + 50);

    // Update the name of each duplicated frame
    duplicatedFrame.name = `${originalFrame.name} ${i + 1}`;

    duplicatedFrame.children.forEach((child: SceneNode) => {
      if (child.type === "GROUP") {
        const group = child as GroupNode;
        // Choose a random child layer to keep
        const randomIndex = Math.floor(Math.random() * group.children.length);
        const layerToKeep = group.children[randomIndex] as SceneNode;

        // Ensure the kept layer is visible
        layerToKeep.visible = true;

        // Remove all other layers
        for (let j = group.children.length - 1; j >= 0; j--) {
          if (group.children[j].id !== layerToKeep.id) {
            group.children[j].remove();
          }
        }
      }
    });
  }

  console.log(`${numDuplicates} frames duplicated with optimized artboards.`);
}

// Show the UI
figma.showUI(__html__, { width: 300, height: 500 });

// Handle messages from the UI
figma.ui.onmessage = (msg: { type: string; numDuplicates: number }) => {
  if (msg.type === 'duplicate') {
    duplicateFrameWithRandomVisibility(msg.numDuplicates);
    figma.closePlugin();
  }
};

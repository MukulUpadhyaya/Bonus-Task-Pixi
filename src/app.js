document.addEventListener("DOMContentLoaded", function () {
  // Create PIXI application
  const app = createPixiApplication();

  // Create container and add it to the stage
  const container = createContainer(app);

  // Load background image and add it to the container
  const background = createBackground(container);

  // Create icons, numbers, and set up click handlers
  const { icons, numbers } = createIconsAndNumbers(container, background);

  // Function to handle icon click
  let clickCount = 0;
  function onClickIcon(icon) {
    // Smooth size increase animation
    icon.interactive = false;
    TweenMax.to(icon.scale, 1, { x: icon.scale.x * 1.1, y: icon.scale.y * 1.1 });

    // Update number on icon
    const index = icons.indexOf(icon);
    const number = numbers[index];
    number.visible = true;
    numbers[index].text = Math.floor(parseInt(numbers[index].text) + 1) * Math.floor(Math.random() * 100);

    // Animate number increase with tween
    TweenMax.fromTo(
      number.scale,
      1.5,
      { x: 0.6, y: 0.6 },
      { x: 1.2, y: 1.2, ease: Power2.easeOut }
    );

    // Increment click count
    clickCount++;

    // Check if more than 6 clicks have occurred
    if (clickCount >= 7) {
      reset();
    }
  }

  // Function to reset application state
  function reset() {
    // Hide icons and reset numbers
    icons.forEach((icon, index) => {
      numbers[index].text = "0";
      numbers[index].visible = false;
    });

    // Reset click count
    clickCount = 0;
  }

  // Function to resize container
  function resizeContainer() {
    const scale = Math.min(app.view.width / background.width, app.view.height / background.height);
    container.scale.set(scale);
    container.position.set((app.view.width - background.width * scale) / 2, (app.view.height - background.height * scale) / 2);
  }

  // Handle window resize event
  window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    resizeContainer();
  });

  // PIXI Application functions
  function createPixiApplication() {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      resizeTo: window,
      backgroundColor: 0x1099bb,
    });
    globalThis.__PIXI_APP__ = app;
    document.body.appendChild(app.view);
    return app;
  }

  function createContainer(app) {
    const container = new PIXI.Container();
    app.stage.addChild(container);
    return container;
  }

  function createBackground(container) {
    const background = PIXI.Sprite.from("Images/BonusFrame.png");
    container.addChild(background);
    return background;
  }

  function createIconsAndNumbers(container, background) {
    const spacingX = 500;
    const spacingY = 500;
    const totalWidth = spacingX * 1.5;
    const iconWidth = (background.width - totalWidth) / 3;
    const iconHeight = (background.height - spacingY) / 2;
    const icons = [];
    const numbers = [];

    for (let i = 0; i < 6; i++) {
      const icon = PIXI.Sprite.from("Images/bonusIcon.png");
      icon.scale.set(1);
      icon.anchor.set(0.5);
      icon.name = `icon_${i}`;
      const row = Math.floor(i / 3);
      const col = i % 3;
      const x = col * (iconWidth + spacingX) + iconWidth / 2 + 350;
      const y = row * (iconHeight + spacingY) + iconHeight / 2 + 250;
      icon.position.set(x, y);
      icon.interactive = true;
      icon.buttonMode = true;
      icon.on("pointerdown", () => onClickIcon(icon));
      container.addChild(icon);
      icons.push(icon);

      const number = new PIXI.Text("0", {
        fontSize: 30,
        fill: "white",
        stroke: "black",
        strokeThickness: 8,
      });
      number.anchor.set(0.5);
      number.visible = false;
      number.position.set(icons[i].x, icons[i].y - 40 + 50);
      container.addChild(number);
      numbers.push(number);
    }

    return { icons, numbers };
  }
});

window.startDemo = function(plugin, media_url) {
    // Create new Scene, Sprite and layer objects
    var scene = new Scene(plugin);
    var sprite = new Sprite(plugin, media_url + "top_hat.jpg", 50, 50, 100, 100);
    var layer = new Layer(plugin, 0, 0, 480, 320);
    layer.setColor(0.2, 0.4, 0.2, 1.0);

    // Add the layer and sprite to the scene
    scene.addChild(layer);
    scene.addChild(sprite);

    // Tell the plugin to run these scene
    plugin.setScene(scene.id);
}

App = {}

$(function() {
    App.model = new JantaModel();
    App.model.load(tempData);

    App.view = new JantaView({el: '#viz', model: App.model});
    App.view.render();
})
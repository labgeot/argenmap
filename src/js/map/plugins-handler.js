class PluginHandler {

    service = null;
    plugins = null;
    excludedPlugins = null;

    constructor(service, plugins, excludedPlugins) {
        this.service = service;
        this.plugins = plugins;
        this.excludedPlugins = excludedPlugins;
        this.loadPlugins();
    }

    loadPlugins() {
        for (const plugin in this.plugins) {
            if (!this.excludedPlugins || !pluginIsExcluded(plugin)) {
                this.service.addPlugin(this.plugins[plugin]);
            }
        }
    }

    pluginIsExcluded(plugin) {
        return this.excludedPlugins.find(excludedPlugin => excludedPlugin === plugin);
    }
}

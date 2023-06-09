const Me = imports.misc.extensionUtils.getCurrentExtension();
const Log = Me.imports.modules.log;
const Resources = Me.imports.modules.resources;
const { Gio } = imports.gi;
var Supported = class Supported {
    constructor() {
        this.supportedProxy = null;
        this.connectedSupported = false;
        this.supportedAttributes = {
            anime: false,
            charge: false,
            platform_profiles: false,
            platform_fancurves: false,
            led_brightness: false,
            led_modes: {
                static: 0,
                breathe: 0,
                pulse: 0
            },
            led_multizone: false,
            led_perKey: false,
            bios_toggleSound: false,
            bios_toggleDGPU: false,
            bios_toggleEGPU: false,
            bios_toggleMUX: false,
            bios_overdrive: false
        };
    }
    getSupported() {
        if (this.isRunning()) {
            try {
                let _supportedAttributes = this.supportedProxy.SupportedFunctionsSync();
                if (_supportedAttributes.length > 0) {
                    let valueString = '';
                    for (const [_key, value] of Object.entries(_supportedAttributes)) {
                        valueString = value.toString();
                        switch (parseInt(_key)) {
                            case 0:
                                this.supportedAttributes.anime = (valueString == 'true' ? true : false);
                                break;
                            case 1:
                                this.supportedAttributes.charge = (valueString == 'true' ? true : false);
                                break;
                            case 2:
                                let platformArray = valueString.split(',');
                                this.supportedAttributes.platform_profiles = (platformArray[0] == 'true' ? true : false);
                                this.supportedAttributes.platform_profiles = (platformArray[1] == 'true' ? true : false);
                                break;
                            case 3:
                                let ledArray = valueString.split(',');
                                this.supportedAttributes.led_brightness = (ledArray[0] == 'true' ? true : false);
                                this.supportedAttributes.led_modes.static = parseInt(ledArray[1]);
                                this.supportedAttributes.led_modes.breathe = parseInt(ledArray[2]);
                                this.supportedAttributes.led_modes.pulse = parseInt(ledArray[3]);
                                this.supportedAttributes.led_multizone = (ledArray[4] == 'true' ? true : false);
                                this.supportedAttributes.led_perKey = (ledArray[5] == 'true' ? true : false);
                                break;
                            case 4:
                                let biosArray = valueString.split(',');
                                this.supportedAttributes.bios_toggleSound = (biosArray[0] == 'true' ? true : false);
                                this.supportedAttributes.bios_toggleMUX = (biosArray[1] == 'true' ? true : false);
                                this.supportedAttributes.bios_overdrive = (biosArray[2] == 'true' ? true : false);
                                this.supportedAttributes.bios_toggleDGPU = (biosArray[3] == 'true' ? true : false);
                                this.supportedAttributes.bios_toggleEGPU = (biosArray[4] == 'true' ? true : false);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            catch (e) {
                Log.error(`Failed to fetch supported functionalities`, e);
            }
        }
    }
    isRunning() {
        return this.connectedSupported;
    }
    async start() {
        try {
            let xml = Resources.File.DBus('org-asuslinux-supported-4');
            this.supportedProxy = new Gio.DBusProxy.makeProxyWrapper(xml)(Gio.DBus.system, 'org.asuslinux.Daemon', '/org/asuslinux/Supported');
            this.connectedSupported = true;
            this.getSupported();
            Log.debug(`Supported Daemon client started successfully.`);
        }
        catch (e) {
            Log.error(`Supported DBus initialization failed!`, e);
        }
    }
    stop() {
        Log.debug(`Stopping Supported DBus client...`);
        if (this.isRunning()) {
            this.connectedSupported = false;
            this.supportedProxy = null;
        }
    }
}
//# sourceMappingURL=supported_dbus.js.map
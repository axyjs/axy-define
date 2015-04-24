/**
 * Settings of the system
 */
module settings {
    "use strict";

    export interface ISettings {
        /**
         * The list of file basenames for index file
         */
        dirMain: string[];

        /**
         * The list of the package.json filed for index file
         */
        packageMain: string[];

        /**
         * The additional list of the wrapper arguments
         */
        wrapperArgs: any[];
    }

    export var instance: ISettings = {
        dirMain: ["index"],
        packageMain: ["main"],
        wrapperArgs: [core.global, core.process]
    };
}

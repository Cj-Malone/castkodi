"use strict";

define(["pebkac"], function (PebkacError) {

    /**
     * L'identifiant de la file d'attente des musiques.
     */
    const PLAYLIST_ID = 0;

    /**
     * L'URL de l'extension pour lire des musiques issues de SoundCloud.
     */
    const PLUGIN_URL = "plugin://plugin.audio.soundcloud/";

    /**
     * Les règles avec les patrons et leur action.
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire une musique sur Kodi.
     *
     * @param {String} url L'URL d'une musique SoundCloud.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules.set([
        "https://soundcloud.com/*/*", "https://mobi.soundcloud.com/*/*"
    ], function (url) {
        // Si le chemin contient plusieurs barres obliques.
        if (url.pathname.indexOf("/", 1) !== url.pathname.lastIndexOf("/"))  {
            return Promise.reject(new PebkacError("noaudio", "SoundCloud"));
        }

        return fetch("https://soundcloud.com/oembed?url=" +
                     encodeURIComponent(url.toString()
                                           .replace("//mobi.", "//")))
                                                     .then(function (response) {
            return response.text();
        }).then(function (response) {
            const RE = /api.soundcloud.com%2Ftracks%2F([^&]+)/;
            const result = RE.exec(response);
            if (null === result) {
                throw new PebkacError("noaudio", "SoundCloud");
            }
            return {
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL + "play/?audio_id=" + result[1]
            };
        });
    });

    return rules;
});

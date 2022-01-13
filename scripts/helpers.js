/** Recursively browse for all font files (maximum of 50) in a directory including subdirectories (maximum of 50 levels deep)
 * @param {string} directory The directory to browse
 * @param {string} l The initial recursion level
 * @return {Promise<string[]>} All of the files in the directory and it's subdirectories
 */
export async function recursiveFileBrowse(directory, l = 0) {
    // Break if recursion limit has been reached
    if (l >= 50) return [];

    // Get the correct source
    const source = directory.startsWith(globalThis?.ForgeVTT?.ASSETS_LIBRARY_URL_PREFIX) ? "forgevtt" : "data";

    // Get the files in that directory and source 
    const res = await FilePicker.browse(source, directory);
    const files = res.files
        // Only use files with valid file extensions
        .filter(file => file.split("/").at(-1).match(/\.otf|\.ttf|\.woff|\.woff2/i, ""))
        // Only use the first 50 
        .slice(0, 50);

    // Recurse if there are subdirectories
    for (const dir of res.dirs) {
        files.push(...await recursiveFileBrowse(dir, l));
        l++;
    }
    return files;
}

/** Run a function once the game is ready
 * @param {function} callback The function to run
 */
export function doOnceReady(callback) {
    if (game.ready) {
        callback();
    } else {
        Hooks.once("ready", callback);
    }
}

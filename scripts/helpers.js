/** Recursively browse for all font files (maximum of 50) in a directory including subdirectories (maximum of 50 levels deep)
 * @param {string} directory The directory to browse
 * @param {string} l The initial recursion level
 * @return {Promise<string[]>} All of the files in the directory and it's subdirectories
 */
export async function recursiveFileBrowse(directory, l = 0) {
    if (l >= 50) return [];
    const res = await FilePicker.browse("data", directory);
    const files = res.files.slice(0, 50).filter(file => file.split("/").at(-1).match(/\.otf|\.ttf|\.woff|\.woff2/i, ""));
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

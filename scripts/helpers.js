/** Recursively browse for all files in a directory including subdirectories
 * @param {string} directory The directory to browse
 * @param {string} l The initial recursion level
 * @return {Promise<string[]>} All of the files in the directory and it's subdirectories
 */
export async function recursiveFileBrowse(directory, l = 0) {
    if (l >= 50) return [];
    const res = await FilePicker.browse("data", directory);
    const files = res.files;
    for (const dir of res.dirs) {
        files.push(...await recursiveFileBrowse(dir, l));
        l++;
    }
    return files;
}

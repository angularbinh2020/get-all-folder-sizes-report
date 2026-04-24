const fs = require('fs').promises;
const path = require('path');

/**
 * Tính tổng dung lượng (byte) của một thư mục (đệ quy)
 * @param {string} dirPath - Đường dẫn thư mục
 * @returns {Promise<number>} - Tổng số byte
 */
async function getDirectorySize(dirPath) {
    let totalSize = 0;

    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory() && !entry.isSymbolicLink()) {
                // Đệ quy vào thư mục con (không theo symlink)
                totalSize += await getDirectorySize(fullPath);
            } else if (entry.isFile()) {
                const stat = await fs.stat(fullPath);
                totalSize += stat.size;
            }
            // Bỏ qua symlink, pipe, socket, ...
        }
    } catch (err) {
        console.error(`Lỗi khi đọc thư mục ${dirPath}:`, err.message);
    }

    return totalSize;
}

/**
 * Định dạng số byte thành dạng dễ đọc (KB, MB, GB)
 * @param {number} bytes
 * @returns {string}
 */
function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Lấy danh sách các thư mục con trực tiếp của một thư mục (không phải symlink)
 * @param {string} parentDir
 * @returns {Promise<string[]>}
 */
async function getSubDirectories(parentDir) {
    const entries = await fs.readdir(parentDir, { withFileTypes: true });
    return entries
        .filter(entry => entry.isDirectory() && !entry.isSymbolicLink())
        .map(entry => path.join(parentDir, entry.name));
}

async function main() {
    // Lấy thư mục cần quét từ tham số dòng lệnh, nếu không có thì dùng thư mục hiện tại
    const targetDir = process.argv[2] || process.cwd();

    console.log(`Đang quét thư mục: ${targetDir}\n`);

    let subDirs;
    try {
        subDirs = await getSubDirectories(targetDir);
        if (subDirs.length === 0) {
            console.log('Không tìm thấy thư mục con nào.');
            return;
        }
    } catch (err) {
        console.error(`Không thể đọc thư mục ${targetDir}:`, err.message);
        process.exit(1);
    }

    // Tính dung lượng song song cho từng thư mục con
    const sizePromises = subDirs.map(async (dir) => {
        const size = await getDirectorySize(dir);
        return { dir, size };
    });

    const folderSizes = await Promise.all(sizePromises);

    // Sắp xếp theo dung lượng giảm dần
    folderSizes.sort((a, b) => b.size - a.size);

    // In kết quả
    console.log('Danh sách thư mục con (theo dung lượng giảm dần):\n');
    for (const { dir, size } of folderSizes) {
        const relativePath = path.relative(targetDir, dir) || path.basename(dir);
        console.log(`${relativePath.padEnd(40)} ${formatSize(size).padStart(12)}`);
    }
}

main().catch(err => {
    console.error('Lỗi không xử lý được:', err);
    process.exit(1);
});
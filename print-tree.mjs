import fs from 'fs'
import path from 'path'

const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', '.turbo', '.next']

function printTree (dir, prefix = '', depth = 3) {
  if (depth < 0) return

  let items
  try {
    items = fs.readdirSync(dir)
  } catch (err) {
    return
  }

  const filtered = items.filter(item => !EXCLUDED_DIRS.includes(item))

  filtered.forEach((item, index) => {
    const fullPath = path.join(dir, item)
    const isDir = fs.statSync(fullPath).isDirectory()
    const connector = index === filtered.length - 1 ? '└── ' : '├── '

    console.log(`${prefix}${connector}${item}`)

    if (isDir) {
      const newPrefix =
        prefix + (index === filtered.length - 1 ? '    ' : '│   ')
      printTree(fullPath, newPrefix, depth - 1)
    }
  })
}

// Cambiá el 3 por el nivel de profundidad que quieras
printTree('.', '', 3)

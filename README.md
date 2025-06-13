# 🧠 lsp-from-scratch

A minimal custom Language Server Protocol (LSP) implementation written in TypeScript, designed to demonstrate how to create your own LSP from scratch. This server provides **text completions** based on a static dictionary.

## ✨ Features

- LSP server implemented in TypeScript
- Uses [`ts-node`](https://typestrong.org/ts-node/) to run directly from source
- Simple dictionary-based autocomplete (textDocument/completion)
- Designed for easy integration with Neovim using Lazy.nvim + `nvim-lspconfig`

---

## 📦 Requirements

- Node.js >= 16
- Neovim >= 0.9
- `ts-node` and `typescript` (installed via `npm install`)
- Lazy.nvim plugin manager (recommended)

---

## 🚀 Installation

### 1. Add to `Lazy.nvim` Plugin List

Paste this into your Lazy plugin spec (e.g. `~/.config/nvim/lua/plugins/lsp.lua`):

```lua
{
  "prashanthbabu07/lsp-from-scratch",
  build = "npm install",
  config = function()
    local lspconfig = require("lspconfig")
    local configs = require("lspconfig.configs")
    local capabilities = require("cmp_nvim_lsp").default_capabilities()

    local plugin_path = vim.fn.stdpath("data") .. "/lazy/lsp-from-scratch"
    local ts_node = plugin_path .. "/node_modules/.bin/ts-node"
    local server_path = plugin_path .. "/server/src/server.ts"

    if not configs.lsp_from_scratch then
      configs.lsp_from_scratch = {
        default_config = {
          cmd = { ts_node, server_path },
          filetypes = { "text" },
          root_dir = function() return vim.fn.getcwd() end,
          settings = {},
        },
      }
    end

    lspconfig.lsp_from_scratch.setup({
      capabilities = capabilities,
      on_attach = function()
        print("✅ lsp-from-scratch attached")
      end,
    })
  end,
  dependencies = {
    "neovim/nvim-lspconfig",
    "hrsh7th/cmp-nvim-lsp",
  },
  ft = { "text" },
}
```

## Acknowledgements

Inspired by video:  
📺 [Writing a Language Server from Scratch in TypeScript](https://www.youtube.com/watch?v=Xo5VXTRoL6Q)


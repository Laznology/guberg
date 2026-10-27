# guberg-mcp

Model Context Protocol (MCP) server for querying and reading Project Gutenberg books with SQLite FTS5 BM25 search.

## Tools

| Tool | Input | Description |
| --- | --- | --- |
| `gutenberg.search_books` | `q` (string, required), `limit` (number, 1-20, default 10) | Search books by title metadata. |
| `gutenberg.get_book` | `bookId` (number, required) | Get book metadata and total passage count. |
| `gutenberg.search_text` | `bookId` (number, required), `q` (string, required), `limit` (number, 1-20, default 8) | Full-text search inside a book using FTS5 BM25 with text snippets. |
| `gutenberg.read` | `bookId` (number, required), `passageId` (number, required), `context` (number, 0-10, default 2) | Read a passage by ID including surrounding context passages. |

---

## Installation & Usage

### 1. Stdio (Local CLI / Editor)

Run directly with Bun:

```bash
bun run stdio
```

MCP Client configuration (e.g. Claude Desktop, Zed, Cursor):

```json
{
  "mcpServers": {
    "gutenberg": {
      "command": "bun",
      "args": ["run", "/path/to/guberg-mcp/src/stdio.ts"]
    }
  }
}
```

### 2. HTTP Server (Localhost)

Start the HTTP server on port 3000:

```bash
bun run dev
# or
bun run start
```

Connect your MCP client to: `http://127.0.0.1:3000/sse`

### 3. Docker (Local Container)

Run container with persistent SQLite volume:

```bash
docker run -d \
  --name guberg-mcp \
  -p 127.0.0.1:3000:3000 \
  -v ./data:/app/data \
  --restart unless-stopped \
  ghcr.io/<owner>/guberg-mcp:latest
```

---

## License

[MIT](LICENSE)

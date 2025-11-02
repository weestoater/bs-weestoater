# MCP Server Configuration Guide

## What are MCP Servers?

Model Context Protocol (MCP) servers extend GitHub Copilot's capabilities by providing access to external data sources and tools. This guide covers the most common and eco-friendly configurations.

## Most Common & Eco-Friendly MCP Servers

### 1. **Filesystem Server** ⭐ Most Eco-Friendly
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "D:\\git\\bs-weestoater"]
    }
  }
}
```
**Benefits:**
- ✅ Zero network overhead
- ✅ Local file access only
- ✅ Minimal CPU/memory usage
- ✅ Perfect for reading project documentation, source code

**Use cases:**
- Reading documentation files
- Accessing configuration files
- Browsing project structure

---

### 2. **Git Server** ⭐ Eco-Friendly
```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "D:\\git\\bs-weestoater"]
    }
  }
}
```
**Benefits:**
- ✅ Local git operations
- ✅ No API calls required
- ✅ Low resource consumption
- ✅ Access to commit history and diffs

**Use cases:**
- Viewing commit history
- Analyzing code changes
- Understanding project evolution

---

### 3. **Memory Server** ⭐ Eco-Friendly
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```
**Benefits:**
- ✅ In-memory knowledge graph
- ✅ No persistent storage
- ✅ Fast operations
- ✅ Session-based context

**Use cases:**
- Storing conversation context
- Building temporary knowledge graphs
- Quick reference storage

---

### 4. **SQLite Server** ⭐ Eco-Friendly
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "--db-path", "D:\\git\\bs-weestoater\\local.db"]
    }
  }
}
```
**Benefits:**
- ✅ Lightweight database
- ✅ No server infrastructure
- ✅ Local queries only
- ✅ Efficient for structured data

**Use cases:**
- Querying local application data
- Test database access
- Development data storage

---

### 5. **GitHub Server** ⚠️ Moderate Impact
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<your-token>"
      }
    }
  }
}
```
**Benefits:**
- 🔄 API calls (uses network)
- ✅ Caching reduces requests
- ✅ Access to issues, PRs, repos

**Use cases:**
- Managing GitHub issues
- Reviewing pull requests
- Searching repositories

**Eco-tip**: Enable response caching to minimize API calls

---

## Recommended Configuration for This Project

Based on your bs-weestoater project structure, here's a recommended eco-friendly setup:

```json
{
  "mcpServers": {
    "project-files": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "D:\\git\\bs-weestoater\\src",
        "D:\\git\\bs-weestoater\\docs"
      ]
    },
    "git-history": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "--repository",
        "D:\\git\\bs-weestoater"
      ]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

## Eco-Friendly Best Practices

### ♻️ Energy Efficiency Tips

1. **Prioritize Local Servers**: Use filesystem, git, and memory servers over API-based ones
2. **Limit Scope**: Only expose necessary directories to filesystem server
3. **Cache Results**: Use memory server to avoid repeated computations
4. **Batch Operations**: Group related queries to minimize server invocations
5. **Close Unused Servers**: Disable servers you're not actively using

### 🌱 Resource Usage Comparison

| Server Type | CPU Usage | Network | Storage | Eco-Rating |
|-------------|-----------|---------|---------|------------|
| Filesystem  | Very Low  | None    | Read-only | ⭐⭐⭐⭐⭐ |
| Git         | Low       | None    | Read-only | ⭐⭐⭐⭐⭐ |
| Memory      | Low       | None    | RAM only  | ⭐⭐⭐⭐⭐ |
| SQLite      | Low       | None    | Local     | ⭐⭐⭐⭐⭐ |
| GitHub      | Medium    | Yes     | None      | ⭐⭐⭐ |
| Web Search  | High      | Heavy   | None      | ⭐⭐ |

## Configuration Location

MCP servers are typically configured in:
- **VS Code**: `.vscode/settings.json` or user settings
- **GitHub Copilot**: Copilot settings panel
- **JetBrains**: IDE settings under GitHub Copilot

## Installation

All the servers mentioned use `npx` which automatically downloads and runs them. No pre-installation needed!

```bash
# They're invoked automatically when configured
# But you can test them manually:
npx -y @modelcontextprotocol/server-filesystem --help
```

## Security Considerations

- ✅ Only expose necessary directories to filesystem server
- ✅ Use read-only access when possible
- ✅ Store GitHub tokens securely (never commit them)
- ✅ Review MCP server permissions regularly

## Project-Specific Use Cases

For **bs-weestoater**, these MCP servers would help with:

1. **Filesystem**: Access football data JSON files, read documentation
2. **Git**: Understand recent changes to football stats and Slimming World features
3. **Memory**: Remember context about your Dundee United tracking system
4. **SQLite**: Could be used for future database-driven features

## Further Reading

- [MCP Specification](https://modelcontextprotocol.io/)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Anthropic's MCP Documentation](https://docs.anthropic.com/claude/docs/model-context-protocol)

---

*Last updated: November 2, 2025*


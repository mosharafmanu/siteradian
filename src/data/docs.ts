export type DocPage = {
  slug: string;
  title: string;
  description: string;
  category: 'Start here' | 'Core concepts' | 'Operate safely' | 'Help';
  updated: string;
  sections: Array<{ title: string; body: string }>;
};

export const docs: DocPage[] = [
  {
    slug: 'getting-started', title: 'Getting started', category: 'Start here', updated: '2026-09-14',
    description: 'Install SiteRadian, connect an assistant, and complete a safe first read in ten clear steps.',
    sections: [
      { title: 'Before you begin', body: `<p>You need a single-site WordPress installation running WordPress 6.4 or newer and PHP 8.0 or newer. Your chosen assistant must be able to reach the site over HTTPS. Claude Desktop and Continue also need Node.js on the computer running the assistant; direct-HTTP clients do not.</p>` },
      { title: '1. Install SiteRadian', body: `<p>In WordPress, open <strong>Plugins → Add New → Upload Plugin</strong>, choose <code>siteradian-1.0.0.zip</code>, install, and activate it. During WordPress.org review, use only the verified package supplied by the project owner.</p>` },
      { title: '2. Open the command center', body: `<p>Select <strong>SiteRadian</strong> in the WordPress admin sidebar. Home shows the current protection mode, connections, pending approvals, recent changes, and the one setup step that needs attention.</p>` },
      { title: '3. Create access', body: `<p>Open <strong>Settings → Connections → Tokens</strong>. Choose a descriptive label, start with <strong>Read-only</strong>, set an expiry, and create the token. The full credential is shown once. Copy it before leaving the screen.</p>` },
      { title: '4. Choose an assistant', body: `<p>Open <strong>Settings → Connections → Assistants</strong> and select the exact client you use. Desktop apps, terminal tools, and editor extensions can require different configuration shapes even when they share a vendor.</p>` },
      { title: '5. Follow the app-specific setup', body: `<p>Use the Recommended steps generated for your site. They already contain the correct REST URL, local server alias, configuration format, and safe credential handling for that client. Merge into shared config files; never overwrite unrelated settings.</p>` },
      { title: '6. Restart or relaunch', body: `<p>Most clients load MCP configuration at startup. Fully restart desktop applications, reload editor windows, or start a fresh terminal process as the selected tutorial directs.</p>` },
      { title: '7. Ask a read-only first question', body: `<pre><code>Inspect my site and tell me what needs attention. Start with system information and do not change anything.</code></pre><p>This proves the assistant can authenticate, discover tools, and return WordPress information without creating a change.</p>` },
      { title: '8. Understand protection', body: `<p>A fresh site uses <strong>Standard protection</strong>: diagnostic reads and low-risk work can run, while medium, high, and critical changes wait for a person. Strict approval also gates low-risk changes. Development removes approval and belongs only on local or staging sites.</p>` },
      { title: '9. Review approvals and changes', body: `<p>When an assistant proposes governed work, open <strong>SiteRadian → Approvals</strong>. Review the exact action, target, risk, and payload. After execution, <strong>Changes</strong> records what happened and whether it can be reversed.</p>` },
      { title: '10. Roll back when supported', body: `<p>Choose Undo from a reversible Changes entry. Undo is itself governed and may wait for approval. SiteRadian skips fields that changed later rather than overwriting newer work.</p>` },
    ],
  },
  {
    slug: 'installation', title: 'Installation', category: 'Start here', updated: '2026-09-14',
    description: 'Requirements, activation behavior, upgrades, deactivation, and data-retention choices.',
    sections: [
      { title: 'Requirements', body: `<ul><li>WordPress 6.4 or newer; tested through WordPress 7.1.</li><li>PHP 8.0 or newer.</li><li>A single WordPress site. Network activation is intentionally refused in 1.0.0.</li><li>Public HTTPS reachability for remote assistant clients.</li></ul>` },
      { title: 'Install and activate', body: `<ol><li>Open <strong>Plugins → Add New → Upload Plugin</strong>.</li><li>Select <code>siteradian-1.0.0.zip</code>.</li><li>Choose <strong>Install Now</strong>, then <strong>Activate</strong>.</li><li>Open <strong>SiteRadian → Home</strong>.</li></ol><p>Activation creates the plugin tables, starts the queue worker, protects its upload directories, and sets Standard protection. It does not contact an AI provider or enable automatic site changes.</p>` },
      { title: 'Upgrade and deactivate', body: `<p>Uploading a later package over an existing installation migrates its schema in place and preserves tokens, approvals, and history. Deactivation stops the worker and the REST/MCP surface but does not delete data.</p>` },
      { title: 'Uninstall and retention', body: `<p>SiteRadian keeps its records by default so an accidental removal does not destroy the audit trail. If you explicitly enable “Also delete all SiteRadian data when the plugin is deleted” under Protection before uninstalling, plugin tables, options, and protected storage are removed.</p>` },
    ],
  },
  {
    slug: 'first-connection', title: 'Your first connection', category: 'Start here', updated: '2026-09-14',
    description: 'Create a narrowly scoped connection and verify it with a non-changing request.',
    sections: [
      { title: 'Choose the exact client', body: `<p>Open <strong>Settings → Connections → Assistants</strong>. Choose the application you actually run—not only its vendor. Codex CLI and Codex in ChatGPT Desktop share a config file but inherit credentials differently; Gemini CLI and Antigravity use different commands and files.</p>` },
      { title: 'Start read-only', body: `<p>Create a Read-only token first. It can inspect supported information but cannot mutate content, submit a write proposal, execute a queue, or elevate its own capabilities.</p>` },
      { title: 'Use generated setup', body: `<p>Follow the selected card’s Recommended flow. SiteRadian generates the correct URL from WordPress, including the query-string form required by Plain permalinks. Configuration examples on this website use <code>example.com</code> and are not substitutes for the site-specific copy.</p>` },
      { title: 'Verify', body: `<pre><code>Run the SiteRadian system_info tool once. Read only; do not change anything.</code></pre><p>A successful response should match the WordPress, PHP, database, theme, and environment on your site. Registration alone is not a connection test.</p>` },
    ],
  },
  {
    slug: 'access-tokens', title: 'Access tokens', category: 'Core concepts', updated: '2026-09-14',
    description: 'Create, scope, expire, revoke, and safely handle SiteRadian credentials.',
    sections: [
      { title: 'One-time reveal', body: `<p>New credentials begin with <code>siteradian_</code>. The complete token is displayed once, then only its hash is retained. SiteRadian cannot show the raw value again after the creation screen is gone.</p>` },
      { title: 'Choose the minimum access', body: `<p>Use Read-only for inspection. For write-capable work, use Full scope and grant only the capabilities the assistant needs. Add an expiry for temporary work and use a label that identifies its app and purpose.</p>` },
      { title: 'Revoke or replace', body: `<p>Revocation takes effect on the next request. If a credential appears in source control, terminal history, a screenshot, or a shared message, revoke it immediately and create a new one.</p>` },
      { title: 'Assistant credentials are separate', body: `<p>A SiteRadian token authenticates an assistant to WordPress. It is not an OpenAI, Anthropic, or Google API key. Provider keys are needed only for optional Built-in AI features and are configured separately.</p>` },
    ],
  },
  {
    slug: 'scoped-access', title: 'Scoped access', category: 'Core concepts', updated: '2026-09-14',
    description: 'Understand the scope and capability checks that occur before an operation can run.',
    sections: [
      { title: 'Four independent controls', body: `<pre><code>token scope → capability → protection mode → destructive guard</code></pre><p>A request must pass every applicable layer. Approval cannot grant a capability the token does not possess, and Development mode does not turn a Read-only credential into a write credential.</p>` },
      { title: 'Read-only and Full', body: `<p><strong>Read-only</strong> is restricted at the MCP transport before a write operation is dispatched. <strong>Full</strong> may request operations allowed by its capabilities; protection rules still decide whether a human must approve.</p>` },
      { title: 'Capabilities', body: `<p>SiteRadian defines 23 named capabilities across content, media, users, WooCommerce, settings, plugins, themes, history, diagnostics, and other operational areas. Grant the narrowest set that supports the job.</p>` },
      { title: 'A denial is useful', body: `<p>When SiteRadian blocks a request, it tells you why—for example, because the token is read-only or the required capability is unavailable. This lets you make a deliberate access decision instead of broadly increasing permissions.</p><aside class="callout"><strong>For developers</strong>API responses may include compatibility error codes such as <code>wpcc_token_read_only</code> and <code>wpcc_capability_denied</code>. These stable codes describe the denial; they are not product names.</aside>` },
    ],
  },
  {
    slug: 'approvals', title: 'Approvals', category: 'Operate safely', updated: '2026-09-14',
    description: 'Review governed operations and understand what happens after a decision.',
    sections: [
      { title: 'When approval appears', body: `<p>Under Standard protection, medium-, high-, and critical-risk changes wait for a human. Strict approval also gates low-risk changes. Diagnostic reads never wait.</p>` },
      { title: 'Review before deciding', body: `<p>The approval screen shows the operation, requested payload, risk, target, and requester. Confirm that the proposed scope matches your instruction before approving. Reject anything unclear or unexpected.</p>` },
      { title: 'Assistants cannot self-approve', body: `<p>Approval endpoints require a WordPress user with the appropriate administrative authority. An MCP credential cannot approve its own request.</p>` },
      { title: 'Do not retry a pending request', body: `<p><code>pending_approval</code> is a normal result. Open the supplied approval link. Retrying submits another request rather than accelerating the first one.</p>` },
    ],
  },
  {
    slug: 'changes', title: 'Changes and audit trail', category: 'Operate safely', updated: '2026-09-14',
    description: 'See what ran, who requested it, and whether the result can be reversed.',
    sections: [
      { title: 'The Changes screen', body: `<p>Changes records structured before/after information, operation status, actor context, time, and rollback availability. It is the place to verify completed assistant work.</p>` },
      { title: 'Audit logging', body: `<p>An additional append-only JSONL audit records the operation lifecycle in protected SiteRadian storage. Secrets are redacted before context is written. Audit writing is best-effort so a logging issue does not strand an otherwise valid governed operation.</p>` },
      { title: 'Not every action is reversible', body: `<p>SiteRadian labels rollback truthfully. Posts, pages, SEO fields, media metadata, options, and several other areas can record reversible field-level changes. Plugin/theme updates and WooCommerce orders are examples that may not offer automatic undo.</p>` },
    ],
  },
  {
    slug: 'rollback', title: 'Rollback', category: 'Operate safely', updated: '2026-09-14',
    description: 'Reverse supported changes without overwriting work that happened later.',
    sections: [
      { title: 'Start from Changes', body: `<p>Open a reversible entry and choose Undo. The rollback request passes through the same protection and approval rules as any other change.</p>` },
      { title: 'Drift-aware restoration', body: `<p>SiteRadian compares the current field value with what the original operation left behind. If another person or process changed the field afterward, that field is skipped rather than clobbered.</p>` },
      { title: 'Partial and conflicted rollback', body: `<p>A partial rollback reports restored fields, skipped fields, and conflicts. If every target field drifted, nothing is changed. Review the conflict details and decide manually.</p>` },
      { title: 'Rollback is not backup', body: `<p>SiteRadian reverses supported individual operations; it is not a complete site backup or disaster-recovery product. Keep normal off-site backups.</p>` },
    ],
  },
  {
    slug: 'protection', title: 'Protection modes', category: 'Core concepts', updated: '2026-09-14',
    description: 'Choose how SiteRadian routes operations through human approval.',
    sections: [
      { title: 'Standard protection', body: `<p>The fresh-install default. Diagnostic reads and low-risk work run immediately; medium, high, and critical changes wait for approval. This balances routine operations with human review of consequential changes.</p>` },
      { title: 'Strict approval', body: `<p>Every write, including low-risk work, waits for a person. Reads remain immediate. Use it where change control matters more than speed.</p>` },
      { title: 'Development', body: `<p>All operations run without the approval step. This mode is clearly marked for local and staging sites only and requires confirmation. Never use it on a production site.</p>` },
      { title: 'Protection is not permission', body: `<p>Modes decide when a human must approve. Token scope, capabilities, WordPress authorization, and the destructive guard remain separate controls.</p>` },
    ],
  },
  {
    slug: 'security', title: 'Security model', category: 'Core concepts', updated: '2026-09-14',
    description: 'A concise technical view of authentication, permissions, approval, storage, and boundaries.',
    sections: [
      { title: 'Credential handling', body: `<p>Tokens are generated from cryptographically secure randomness, revealed once, and hashed before storage. Token comparison does not depend on recovering the raw credential. You can revoke or delete access at any time.</p>` },
      { title: 'Authorization path', body: `<p>Scope is enforced before dispatch. Capabilities narrow the operations a Full token may request. Protection determines whether human approval is required, and permanent deletion requires an explicit destructive-confirmation handshake.</p>` },
      { title: 'Protected local data', body: `<p>Tokens, audit records, and undo snapshots live under randomized protected upload directories on your own WordPress site. SiteRadian also writes denial rules and directory-index guards.</p>` },
      { title: 'Outbound behavior', body: `<p>By default SiteRadian contacts no external service and includes no analytics or telemetry. Optional Built-in AI calls only the provider you configure, for the feature you invoke.</p>` },
    ],
  },
  {
    slug: 'troubleshooting', title: 'Troubleshooting', category: 'Help', updated: '2026-09-14',
    description: 'Diagnose missing tokens, 401s, unavailable tools, approvals, and rollback conflicts.',
    sections: [
      { title: 'Codex: SITERADIAN_TOKEN is not set', body: `<p>The MCP registration persists in <code>~/.codex/config.toml</code>. A terminal export does not persist after that session is gone. Return to the terminal where you set it, or export a valid token again in the new terminal before starting Codex. You do not need to recreate the registration when <code>codex mcp list</code> already shows <code>siteradian</code>.</p>` },
      { title: '401 or missing token', body: `<p>Create a fresh token, verify it has not expired or been revoked, and confirm the client sends <code>Authorization: Bearer …</code>. Some Apache/FastCGI configurations strip this header; configure the server to forward <code>HTTP_AUTHORIZATION</code>.</p>` },
      { title: 'The client shows no tools', body: `<ol><li>For Claude Desktop or Continue, verify <code>node --version</code>.</li><li>Confirm the plugin-generated connector URL returns HTTP 200.</li><li>Restart the client after saving configuration.</li><li>Check that the server entry is inside the exact root key the client expects.</li></ol>` },
      { title: 'Everything waits for approval', body: `<p>Standard protection gates medium-or-higher changes; Strict gates every write. Approve under <strong>SiteRadian → Approvals</strong>. Do not switch a production site to Development merely to avoid review.</p>` },
      { title: 'Read-only or missing capability', body: `<p>A Read-only token cannot write. A capability denial names the capability required. Create or edit access deliberately; approval cannot override a missing permission.</p>` },
      { title: 'Undo was partial', body: `<p>Fields changed after the original operation are skipped. Review the returned restored, skipped, and conflict fields rather than forcing older data over newer work.</p>` },
    ],
  },
];

export const docBySlug = new Map(docs.map(doc => [doc.slug, doc]));
export const docCategories = ['Start here', 'Core concepts', 'Operate safely', 'Help'] as const;

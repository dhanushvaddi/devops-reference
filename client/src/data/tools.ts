export interface Section {
  title: string;
  bullets: string[];
  code?: string;
}

export interface QA {
  q: string;
  a: string;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  cat: 'core' | 'security' | 'obs' | 'cloud';
  overview: string;
  sections: Section[];
  qa: QA[];
  tip: string;
}

export const CAT_MAP: Record<string, string> = {
  core: 'Core DevOps',
  security: 'Security & Quality',
  obs: 'Observability',
  cloud: 'Cloud',
};

export const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  core: { bg: 'bg-primary-light', text: 'text-primary', border: 'border-primary' },
  security: { bg: 'bg-orange-light', text: 'text-orange', border: 'border-orange' },
  obs: { bg: 'bg-success-light', text: 'text-success-dark', border: 'border-success' },
  cloud: { bg: 'bg-purple-light', text: 'text-purple', border: 'border-purple' },
};

export const TOOLS: Tool[] = [
  // ============================================================
  // LINUX
  // ============================================================
  {
    id: 'linux', name: 'Linux', icon: 'terminal', cat: 'core',
    overview: 'Linux is the backbone of DevOps. Every server, container, and CI runner runs Linux. Master file permissions, process management, networking, systemd services, log analysis, and shell scripting to ace any DevOps interview.',
    sections: [
      { title: 'File System & Permissions', bullets: [
        'chmod 755 = rwxr-xr-x (owner: full, group/others: read+execute)',
        'chmod u+x, g-w symbolic mode \u2014 more readable than octal',
        'chown user:group file \u2014 change ownership recursively with -R',
        'umask 022 \u2192 new files get 644, new dirs get 755',
        'Special bits: setuid(s) runs as owner, setgid(s) inherits group, sticky(t) prevents deletion by non-owners',
        'find / -perm /4000 \u2014 audit all setuid files (critical for security)',
        'ACLs (setfacl/getfacl) for fine-grained permissions beyond owner/group/other',
        '/etc/fstab controls mount points at boot \u2014 know noexec, nosuid, nodev mount options',
      ], code: 'ls -la /etc/passwd\nchmod 600 ~/.ssh/id_rsa          # private key: owner read/write only\nchown -R deploy:deploy /opt/app\nfind /var/log -type f -mtime -1   # files modified last 24h\ndu -sh /var/log/* | sort -rh | head  # largest log dirs\ndf -hT                             # disk free with filesystem type\nlsblk                              # block device tree\nmount | grep -E "^/dev"            # currently mounted devices' },
      { title: 'Process Management & Systemd', bullets: [
        'ps aux \u2014 all processes with CPU/mem usage',
        'top / htop \u2014 live process viewer (htop has better UX)',
        'SIGTERM (15) = graceful shutdown; SIGKILL (9) = force kill (last resort)',
        'nice/renice \u2014 change process priority (-20 highest, 19 lowest)',
        'nohup command & \u2014 survives terminal close; or use tmux/screen',
        'systemctl: start/stop/restart/status/enable/disable services',
        'journalctl -u nginx -f --since "1 hour ago" \u2014 live service logs',
        'cgroups v2: control CPU, memory, IO limits per process group',
        '/proc filesystem: /proc/PID/status, /proc/meminfo, /proc/cpuinfo',
      ], code: 'ps aux | grep java | grep -v grep\nkill -9 $(lsof -t -i:8080)        # kill process on port 8080\nsystemctl status nginx\nsystemctl enable --now myapp       # enable + start in one command\njournalctl -u nginx -f --since "1 hour ago"\nstrace -p PID -e trace=network     # trace network syscalls\nlsof -i :443                       # who is using port 443\npgrep -af "python"                 # find python processes' },
      { title: 'Networking & Troubleshooting', bullets: [
        'ss -tulnp \u2014 listening ports with PIDs (replaces netstat)',
        'ip addr / ip route \u2014 interfaces and routing tables',
        'curl -v / wget \u2014 HTTP debugging (-v shows TLS handshake, headers)',
        'dig / nslookup \u2014 DNS resolution debugging',
        'traceroute / mtr \u2014 network path tracing (mtr combines ping+traceroute)',
        'iptables / nftables / ufw \u2014 firewall rules (iptables is legacy, nftables is modern)',
        'tcpdump -i eth0 port 80 \u2014 packet capture for debugging',
        'netcat (nc) \u2014 test TCP/UDP connectivity: nc -zv host port',
        '/etc/resolv.conf \u2014 DNS resolver config; /etc/hosts \u2014 static host mappings',
      ], code: 'ss -tulnp | grep :8080\ncurl -vk https://api.example.com/health\ndig +short api.example.com\ndig @8.8.8.8 example.com            # query specific DNS server\ntraceroute -n api.example.com\ntcpdump -i eth0 -n port 443 -c 50  # capture 50 packets on port 443\nnc -zv db.internal 5432             # test postgres connectivity\nip route show\ncat /etc/resolv.conf' },
      { title: 'Shell Scripting & Text Processing', bullets: [
        'Bash variables: VAR="value", use $VAR or ${VAR}',
        'Exit codes: 0 = success, non-zero = failure; $? holds last exit code',
        'set -euo pipefail \u2014 strict mode (exit on error, undefined vars, pipe failures)',
        'grep -rn "pattern" /path \u2014 recursive search with line numbers',
        'awk \'{print $1, $3}\' \u2014 column extraction; sed \'s/old/new/g\' \u2014 text replacement',
        'xargs \u2014 build commands from stdin: find . -name "*.log" | xargs rm',
        'jq \u2014 parse JSON in shell: curl api | jq \'.data[].name\'',
        'Heredoc for multi-line strings: cat <<EOF ... EOF',
      ], code: '#!/bin/bash\nset -euo pipefail\n\n# Check if service is healthy\nHTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)\nif [ "$HTTP_CODE" -ne 200 ]; then\n  echo "Health check failed: $HTTP_CODE"\n  systemctl restart myapp\n  exit 1\nfi\n\n# Process logs\ncat /var/log/app.log | grep ERROR | awk \'{print $1, $2, $NF}\' | sort | uniq -c | sort -rn | head\n\n# Disk cleanup\nfind /tmp -type f -mtime +7 -delete' },
      { title: 'Performance & Monitoring', bullets: [
        'vmstat 1 5 \u2014 CPU, memory, IO stats every 1 second, 5 samples',
        'iostat -x 1 \u2014 disk IO stats with extended info',
        'sar \u2014 historical system activity (CPU, memory, network over time)',
        'free -h \u2014 memory summary (total, used, free, available, cached)',
        'uptime / w \u2014 load averages (1, 5, 15 min) and logged-in users',
        'dmesg -T \u2014 kernel ring buffer with human-readable timestamps',
        'OOM killer: check dmesg for "Out of memory" \u2014 tune vm.overcommit_memory',
        '/proc/sys/vm/ \u2014 tune swappiness, dirty_ratio, overcommit settings',
      ], code: 'vmstat 1 5                         # CPU/mem/IO every second\niostat -x 1                        # disk IO utilization\nfree -h                            # memory summary\nuptime                             # load averages\nsar -u 1 10                        # CPU usage 10 samples\ndmesg -T | tail -20                # recent kernel messages\ncat /proc/meminfo | head -5\nsysctl vm.swappiness               # current swap setting' },
    ],
    qa: [
      { q: 'How do you find which process is using port 8080?', a: 'ss -tulnp | grep :8080 shows the process using port 8080. Alternative: lsof -i :8080. Add sudo to see all processes. Get the PID from output, then ps -p PID -f for full details including the command that started it.' },
      { q: 'Hard link vs soft link?', a: 'Hard link: another directory entry pointing to the same inode (same data on disk). Soft/symlink: a separate file containing a path to the target. Hard links cannot cross filesystem boundaries and cannot link to directories. Deleting the original file breaks a symlink but not a hard link (data persists until all hard links are removed).' },
      { q: 'How do you check memory usage and diagnose OOM issues?', a: 'free -h for summary (check "available" column, not "free"). cat /proc/meminfo for detail. top/htop sorted by %MEM for per-process view. For OOM: check dmesg | grep -i "out of memory" to find which process was killed. Tune vm.overcommit_memory and set appropriate memory limits in systemd units or cgroup configs.' },
      { q: 'How do you run a process that survives logout?', a: 'nohup command & (redirects stdout to nohup.out). Better: use tmux/screen for interactive sessions. For production services, always use systemd: create a unit file in /etc/systemd/system/, then systemctl enable --now myservice. Systemd handles restart policies, logging, dependencies, and resource limits.' },
      { q: 'Explain the boot process of a Linux system.', a: 'BIOS/UEFI \u2192 bootloader (GRUB2) \u2192 kernel loads + initramfs \u2192 kernel mounts root filesystem \u2192 init system (systemd PID 1) starts \u2192 systemd reads default.target \u2192 starts services in dependency order. Use systemd-analyze blame to see which services slow down boot.' },
      { q: 'What is the difference between /etc/resolv.conf and /etc/hosts?', a: '/etc/hosts is a static lookup table (checked first by default). /etc/resolv.conf configures DNS resolver servers (nameserver directives) and search domains. Resolution order is controlled by /etc/nsswitch.conf (files dns means check /etc/hosts first, then DNS). In containers, both are often dynamically generated.' },
      { q: 'How would you troubleshoot a server running slowly?', a: 'Systematic approach: (1) uptime \u2014 check load averages vs CPU count. (2) top/htop \u2014 identify CPU/memory hogs. (3) vmstat 1 \u2014 check if CPU-bound (high us/sy) or IO-bound (high wa). (4) iostat -x \u2014 check disk utilization and await times. (5) free -h \u2014 check if swapping. (6) ss -s \u2014 check for connection floods. (7) dmesg -T \u2014 check for hardware errors or OOM kills.' },
      { q: 'What is swap and when should you use it?', a: 'Swap is disk space used as virtual memory when RAM is full. The kernel moves inactive pages to swap (controlled by vm.swappiness, 0-100). For servers: keep swappiness low (10-30). For databases: some recommend swappiness=1 or even disabling swap to prevent latency spikes. Kubernetes nodes typically have swap disabled (required by kubelet by default).' },
      { q: 'Explain cgroups and how they relate to containers.', a: 'cgroups (control groups) limit, account for, and isolate resource usage (CPU, memory, IO, network) of process groups. Docker/containerd use cgroups to enforce --memory and --cpus limits on containers. cgroups v2 (unified hierarchy) is the modern standard. Kubernetes uses cgroups to enforce resource requests/limits defined in pod specs.' },
    ],
    tip: 'Always prefer ss over netstat (deprecated in modern distros). Use journalctl with filters (-u, --since, -p err) over reading raw log files. In interviews, demonstrate the troubleshooting methodology: start broad (uptime, top) then narrow down (iostat, strace).',
  },

  // ============================================================
  // GIT
  // ============================================================
  {
    id: 'git', name: 'Git', icon: 'git-branch', cat: 'core',
    overview: 'Git is the universal version control system. DevOps interviews probe branching strategies, history manipulation (rebase, revert, reset), collaboration workflows, merge conflict resolution, and disaster recovery with reflog.',
    sections: [
      { title: 'Core Concepts & Internals', bullets: [
        'Three trees: Working directory \u2192 Staging (index) \u2192 Local repo \u2192 Remote',
        'HEAD = pointer to current commit/branch tip',
        'Detached HEAD = HEAD points to a SHA, not a branch name (changes are orphaned)',
        'git fetch = download refs + objects; git pull = fetch + merge (or rebase)',
        'git stash = shelve uncommitted changes onto a stack',
        'git reflog = history of all HEAD movements for 90 days (your safety net)',
        'Objects: blob (file content), tree (directory), commit (snapshot + metadata), tag (named pointer)',
        '.git/config \u2014 repo-level settings; ~/.gitconfig \u2014 global settings',
      ], code: 'git log --oneline --graph --all --decorate\ngit diff HEAD~2 HEAD -- file.txt    # compare specific commits\ngit stash push -m "WIP feature-x"\ngit stash list                      # see all stashes\ngit stash pop                       # restore + delete stash\ngit reflog show HEAD                # all HEAD movements\ngit cat-file -t HEAD                # show object type\ngit cat-file -p HEAD                # show commit details' },
      { title: 'Branching Strategies', bullets: [
        'GitFlow: main/develop/feature/release/hotfix \u2014 suits versioned release cycles',
        'Trunk-based: short-lived branches (<1 day), merge to main daily \u2014 suits CI/CD',
        'GitHub Flow: feature branch \u2192 PR \u2192 review \u2192 merge to main \u2192 deploy',
        'Branch protection: require PR reviews, status checks, signed commits',
        'CODEOWNERS file: auto-assign reviewers based on file paths changed',
        'Release branches: cut from main when ready, cherry-pick hotfixes back',
        'Feature flags: decouple deployment from release \u2014 merge incomplete code safely',
      ], code: 'git checkout -b feature/JIRA-123-auth\ngit rebase main                    # rebase onto latest main\ngit merge --no-ff feature/x        # preserve merge commit in history\ngit cherry-pick abc1234             # apply specific commit\ngit branch -d feature/old          # delete merged branch\ngit push origin --delete feature/old  # delete remote branch' },
      { title: 'History Manipulation & Recovery', bullets: [
        'git rebase -i HEAD~3 \u2014 squash/reword/drop/reorder commits interactively',
        'git reset --soft HEAD~1 \u2014 undo commit, keep changes staged',
        'git reset --mixed HEAD~1 \u2014 undo commit, keep changes unstaged (default)',
        'git reset --hard HEAD~1 \u2014 DANGER: discards all changes permanently',
        'git revert SHA \u2014 safe undo: creates a new commit that reverses changes',
        'git bisect \u2014 binary search through commits to find bug introduction',
        'git reflog + git reset --hard <reflog-SHA> \u2014 recover from bad reset',
        'git commit --amend \u2014 modify last commit message or add forgotten files',
      ], code: 'git rebase -i HEAD~3              # interactive rebase\n# In editor: pick/squash/reword/drop\ngit revert HEAD --no-edit          # undo last commit safely\ngit reset --soft HEAD~1            # uncommit but keep staged\ngit bisect start\ngit bisect bad                     # current commit is bad\ngit bisect good v1.0               # v1.0 was good\n# Git checks out middle commit; test and mark good/bad\ngit bisect reset                   # done, return to original' },
      { title: 'Merge Conflicts & Collaboration', bullets: [
        'Conflicts occur when two branches modify the same lines differently',
        'Conflict markers: <<<<<<< HEAD (yours) ||||||| (ancestor) ======= (theirs) >>>>>>>',
        'git mergetool \u2014 launch configured merge tool (vimdiff, meld, VS Code)',
        'Resolve: edit file, remove markers, git add, git commit',
        'git merge --abort or git rebase --abort to cancel mid-conflict',
        'Reduce conflicts: rebase frequently, keep branches short-lived',
        'git blame file \u2014 show who last modified each line (useful for context)',
        'git log --merge \u2014 show commits involved in a merge conflict',
      ], code: '# During merge conflict:\ngit status                         # shows conflicted files\n# Edit files, resolve conflicts\ngit add resolved-file.txt\ngit commit                         # completes the merge\n\n# Or abort:\ngit merge --abort\n\n# Blame for context:\ngit blame -L 10,20 src/app.js      # blame lines 10-20\ngit log -p -S "functionName"       # find when function was added/removed' },
    ],
    qa: [
      { q: 'git rebase vs git merge?', a: 'Merge preserves full history including branch topology (merge commits). Rebase replays your commits on top of another branch for a linear, clean history. Use rebase for local feature branches before opening a PR. Use merge for integrating completed work into main. Golden rule: never rebase commits that have been pushed to a shared branch.' },
      { q: 'How do you revert a pushed commit?', a: 'git revert <SHA> creates a new commit that undoes the change \u2014 safe for shared branches because it preserves history. Never use git reset --hard on pushed commits unless you are the sole contributor and can force-push. For reverting a merge commit: git revert -m 1 <merge-SHA> where -m 1 selects the mainline parent.' },
      { q: 'What is a detached HEAD and how do you fix it?', a: 'HEAD points to a specific commit SHA instead of a branch name. Any new commits are orphaned (not on any branch). Fix: git checkout -b recovery-branch to capture current work as a new branch. Or git checkout main to abandon changes. This often happens when checking out a tag or specific commit.' },
      { q: 'How do you squash commits before a PR?', a: 'git rebase -i HEAD~N, then mark commits as "squash" (s) to combine with the previous. Or "fixup" (f) to squash and discard the commit message. Alternative: git merge --squash feature-branch on the target branch. Best practice: squash WIP/fixup commits but keep logical commits separate for reviewability.' },
      { q: 'How do you recover lost commits?', a: 'git reflog shows every HEAD movement for 90 days. Find the lost commit SHA in reflog output, then git reset --hard <SHA> to restore it, or git cherry-pick <SHA> to apply it to current branch. Reflog is local only \u2014 it does not sync to remotes. This is why "nothing is truly lost in Git for 90 days."' },
      { q: 'Explain Git hooks and how they are used in CI/CD.', a: 'Git hooks are scripts triggered by Git events. Client-side: pre-commit (linting, formatting), commit-msg (enforce message format), pre-push (run tests). Server-side: pre-receive (enforce policies), post-receive (trigger CI). Tools like Husky manage client hooks. Use pre-commit hooks for Gitleaks (secret scanning), ESLint, Prettier. Hooks are not versioned by default \u2014 use .husky/ or .githooks/ directory with core.hooksPath config.' },
      { q: 'What is git cherry-pick and when would you use it?', a: 'Cherry-pick applies a specific commit from one branch to another without merging the entire branch. Use cases: backporting a critical bugfix from main to a release branch, or pulling a single useful commit from an experimental branch. Syntax: git cherry-pick <SHA>. For a range: git cherry-pick A..B. Be cautious: cherry-picked commits get new SHAs, so avoid cherry-picking then merging the same branch later.' },
      { q: 'How do you handle large files in Git?', a: 'Git LFS (Large File Storage) replaces large files with text pointers in the repo, storing actual file content on a separate server. Install: git lfs install, then git lfs track "*.psd". The .gitattributes file records LFS patterns. Without LFS, large files bloat the repo permanently (even after deletion, they remain in history). Use BFG Repo-Cleaner or git filter-branch to remove accidentally committed large files from history.' },
      { q: 'What is the difference between git fetch and git pull?', a: 'git fetch downloads new commits, branches, and tags from the remote but does NOT modify your working directory or current branch. git pull = git fetch + git merge (or git rebase if configured with pull.rebase=true). Best practice: fetch first, review changes with git log origin/main..HEAD, then merge or rebase deliberately. This prevents surprise merge conflicts.' },
    ],
    tip: 'git reflog is your ultimate safety net. It tracks every HEAD movement for 90 days. If you think you lost work from a bad reset or rebase, run git reflog show HEAD first. In interviews, mentioning reflog shows advanced Git knowledge.',
  },

  // ============================================================
  // GITHUB ACTIONS
  // ============================================================
  {
    id: 'gha', name: 'GitHub Actions', icon: 'workflow', cat: 'core',
    overview: 'GitHub Actions is CI/CD built into GitHub. Workflows are YAML files in .github/workflows/. Master the structure, event triggers, secrets management, caching, matrix builds, reusable workflows, and OIDC for cloud authentication.',
    sections: [
      { title: 'Workflow Structure & Triggers', bullets: [
        'on: trigger events \u2014 push, pull_request, schedule, workflow_dispatch, repository_dispatch',
        'jobs: parallel execution units, each runs on a fresh runner (ubuntu-latest, windows-latest, macos-latest)',
        'steps: sequential tasks inside a job, share the same workspace and environment',
        'uses: reference a marketplace action or reusable workflow',
        'run: execute inline shell commands',
        'needs: creates dependency between jobs (serial execution)',
        'if: conditional execution \u2014 if: github.ref == \'refs/heads/main\'',
        'concurrency: group + cancel-in-progress for deduplication',
        'workflow_dispatch: inputs allow manual triggers with parameters',
      ], code: 'on:\n  push:\n    branches: [main, "release/*"]\n    paths-ignore: ["docs/**", "*.md"]\n  pull_request:\n    types: [opened, synchronize, reopened]\n  schedule:\n    - cron: "0 2 * * 1"       # Monday 2am UTC\n  workflow_dispatch:\n    inputs:\n      environment:\n        type: choice\n        options: [staging, production]\n        default: staging' },
      { title: 'Secrets, Variables & OIDC', bullets: [
        'secrets.MY_SECRET \u2014 encrypted, masked in logs, available at org/repo/environment level',
        'GITHUB_TOKEN \u2014 auto-generated, scoped to repo, expires when job completes',
        'vars.MY_VAR \u2014 non-secret configuration variables (new feature)',
        'OIDC: federate to AWS/Azure/GCP \u2014 no long-lived credentials stored',
        'Environment secrets: scoped to specific environments (prod/staging) with approval gates',
        'permissions: \u2014 restrict GITHUB_TOKEN to minimum needed (contents: read, id-token: write)',
        'Never echo secrets in run steps \u2014 even masked, they can be exfiltrated via encoding',
        'Environment protection rules: required reviewers, wait timers, deployment branches',
      ], code: 'permissions:\n  contents: read\n  id-token: write           # required for OIDC\n  pull-requests: write      # for PR comments\n\njobs:\n  deploy:\n    environment: production  # triggers approval gate\n    steps:\n    - uses: aws-actions/configure-aws-credentials@v4\n      with:\n        role-to-assume: ${{ secrets.AWS_ROLE_ARN }}\n        aws-region: us-east-1\n    - run: aws s3 sync ./dist s3://${{ vars.BUCKET_NAME }}' },
      { title: 'Caching, Artifacts & Matrix', bullets: [
        'actions/cache \u2014 cache dependencies between runs (.m2, node_modules, pip)',
        'Cache key: hash of lock file ensures cache invalidation on dependency changes',
        'actions/upload-artifact / download-artifact \u2014 share files between jobs',
        'Matrix strategy: test across multiple OS, language versions, or configurations in parallel',
        'fail-fast: false \u2014 continue other matrix jobs even if one fails',
        'Artifacts are retained for 90 days by default (configurable)',
        'Self-hosted runners: use for private network access, GPU workloads, or custom environments',
      ], code: '- uses: actions/cache@v4\n  with:\n    path: ~/.m2/repository\n    key: ${{ runner.os }}-maven-${{ hashFiles("**/pom.xml") }}\n    restore-keys: ${{ runner.os }}-maven-\n\nstrategy:\n  fail-fast: false\n  matrix:\n    os: [ubuntu-latest, windows-latest]\n    node: [18, 20, 22]\n    exclude:\n      - os: windows-latest\n        node: 18' },
      { title: 'Reusable Workflows & Composite Actions', bullets: [
        'Reusable workflows: workflow_call trigger \u2014 DRY across repos',
        'Composite actions: bundle multiple steps into a single reusable action',
        'inputs/outputs/secrets \u2014 parameterize reusable workflows',
        'Caller workflow uses: org/repo/.github/workflows/shared.yml@main',
        'Composite actions live in action.yml with runs: using: composite',
        'Use reusable workflows for standardized CI/CD pipelines across teams',
        'Pin actions to SHA, not tags: uses: actions/checkout@a81bbb... for supply chain security',
      ], code: '# .github/workflows/reusable-build.yml\non:\n  workflow_call:\n    inputs:\n      environment:\n        type: string\n        required: true\n    secrets:\n      DEPLOY_KEY:\n        required: true\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n    - run: npm ci && npm run build\n    - run: deploy --env ${{ inputs.environment }}' },
    ],
    qa: [
      { q: 'How do you trigger a workflow on a specific branch only?', a: 'on: push: branches: [main] or on: pull_request: branches: [main]. Glob patterns work: "release/*", "feature/**". Exclude with branches-ignore: ["dependabot/**"]. Combine with paths: to trigger only when specific files change, e.g., paths: ["src/**", "!src/**/*.test.ts"].' },
      { q: 'How do you share data between jobs?', a: 'Two methods: (1) Artifacts: actions/upload-artifact in job A, actions/download-artifact in job B \u2014 for files. (2) Outputs: define outputs in job A, reference via needs.jobA.outputs.myOutput in job B \u2014 for small string values. Jobs run on separate runners with no shared filesystem, so local files do not persist between jobs.' },
      { q: 'Job vs step \u2014 what is the difference?', a: 'Jobs run in parallel on separate runners by default (use needs: for serial execution). Steps run sequentially within a single job, sharing the same runner, workspace, filesystem, and environment variables. Use multiple jobs for parallelism (e.g., lint + test + build simultaneously) and steps for sequential operations within a phase.' },
      { q: 'How do you avoid storing cloud credentials as secrets?', a: 'Use OIDC (OpenID Connect). Configure your cloud provider (AWS/Azure/GCP) to trust GitHub as an OIDC identity provider. At runtime, GitHub issues a short-lived JWT token; the cloud provider exchanges it for temporary credentials scoped to a specific IAM role. Zero long-lived secrets stored in GitHub. This is the recommended approach for all cloud authentication.' },
      { q: 'How do you handle workflow failures and retries?', a: 'Use continue-on-error: true on a step to prevent job failure. Check step outcome with if: steps.stepId.outcome == \'failure\'. For retries, use a marketplace action like nick-fields/retry with configurable attempts and delay. For deployment rollbacks, chain a rollback job with if: failure() that runs when the deploy job fails.' },
      { q: 'What are environment protection rules?', a: 'Environments (Settings > Environments) add deployment gates: required reviewers (approval before deploy), wait timers (delay N minutes), deployment branch restrictions (only main can deploy to prod), and environment-specific secrets/variables. Combined with OIDC, this creates a secure deployment pipeline with human approval for production.' },
      { q: 'How do you speed up GitHub Actions workflows?', a: 'Key optimizations: (1) Cache dependencies aggressively (actions/cache). (2) Use matrix builds for parallel testing. (3) paths: filter to skip unnecessary runs. (4) concurrency groups with cancel-in-progress to abort stale runs. (5) Composite actions to reduce step overhead. (6) Self-hosted runners for faster hardware. (7) Skip CI with [skip ci] in commit message.' },
      { q: 'How do you secure GitHub Actions against supply chain attacks?', a: 'Pin actions to full SHA hashes, not tags (tags can be moved). Use Dependabot for automated action updates. Set permissions: to minimum needed per workflow. Use environment protection rules for sensitive deployments. Audit third-party actions before use. Enable required workflows at org level for security scanning.' },
    ],
    tip: 'Always use concurrency groups with cancel-in-progress: true to cancel stale runs on the same PR. Pin actions to SHA for security. Use OIDC instead of stored credentials for cloud access.',
  },

  // ============================================================
  // JENKINS
  // ============================================================
  {
    id: 'jenkins', name: 'Jenkins', icon: 'hard-hat', cat: 'core',
    overview: 'Jenkins is the most widely used open-source CI/CD server. Focus on Declarative Pipeline syntax, agent/controller architecture, shared libraries, credentials management, and pipeline-as-code best practices.',
    sections: [
      { title: 'Architecture & Concepts', bullets: [
        'Controller (Master): orchestrates pipelines, stores config, serves web UI',
        'Agent (Worker): executes build steps on separate machines via JNLP or SSH',
        'Executor: a build slot on an agent (configurable per agent)',
        'Label: tag agents for routing \u2014 agent { label "docker && linux" }',
        'Shared Library: reusable Groovy code across all pipelines in the org',
        'Flyweight executor: controller-side lightweight execution for orchestration',
        'Jenkins distributed builds: scale horizontally by adding agents',
        'Blue Ocean: modern UI for pipeline visualization (now deprecated in favor of pipelines UI)',
      ], code: 'pipeline {\n  agent { label "docker" }\n  options {\n    timeout(time: 30, unit: "MINUTES")\n    disableConcurrentBuilds()\n    buildDiscarder(logRotator(numToKeepStr: "10"))\n  }\n  environment {\n    APP_ENV = "prod"\n    DOCKER_IMAGE = "myapp:${BUILD_NUMBER}"\n  }\n  stages {\n    stage("Build")  { steps { sh "mvn clean package -DskipTests" } }\n    stage("Test")   { steps { sh "mvn test" } }\n    stage("Docker") { steps { sh "docker build -t ${DOCKER_IMAGE} ." } }\n    stage("Deploy") {\n      when { branch "main" }\n      steps { sh "kubectl set image deploy/app app=${DOCKER_IMAGE}" }\n    }\n  }\n  post {\n    failure { mail to: "team@co.com", subject: "Build #${BUILD_NUMBER} failed" }\n    always  { cleanWs() }\n  }\n}' },
      { title: 'Credentials & Security', bullets: [
        'Credentials store: username/password, secret text, SSH key, certificate, secret file',
        'withCredentials([]) \u2014 inject secrets scoped to a block, masked in console output',
        'Credential scoping: system (Jenkins internals), global (all jobs), folder-level',
        'RBAC plugin (Role-Based Access Control) \u2014 restrict job access by user/group',
        'Audit Trail plugin \u2014 log all user actions for compliance',
        'Pipeline sandbox: Groovy scripts are sandboxed; unsafe methods require admin approval',
        'Never hardcode secrets in Jenkinsfile \u2014 use credentials store exclusively',
        'Rotate credentials regularly; use short-lived tokens where possible',
      ], code: 'withCredentials([\n  usernamePassword(\n    credentialsId: "docker-hub",\n    usernameVariable: "USER",\n    passwordVariable: "PASS"\n  ),\n  string(\n    credentialsId: "sonar-token",\n    variable: "SONAR_TOKEN"\n  )\n]) {\n  sh "docker login -u $USER -p $PASS"\n  sh "mvn sonar:sonar -Dsonar.login=$SONAR_TOKEN"\n}' },
      { title: 'Shared Libraries & Pipeline-as-Code', bullets: [
        'Shared library structure: vars/ (global functions), src/ (classes), resources/ (non-Groovy files)',
        'Configure in Manage Jenkins > System > Global Pipeline Libraries',
        'Import: @Library("my-lib") _ or @Library("my-lib@v1.2") _',
        'vars/buildJava.groovy \u2014 defines a reusable pipeline step callable as buildJava()',
        'Jenkinsfile in repo root \u2014 pipeline-as-code, version-controlled with application',
        'Multibranch Pipeline: auto-discovers branches with Jenkinsfile',
        'Seed jobs with Job DSL plugin \u2014 programmatically create Jenkins jobs',
      ], code: '// vars/standardPipeline.groovy (shared library)\ndef call(Map config) {\n  pipeline {\n    agent { label config.agent ?: "docker" }\n    stages {\n      stage("Build") {\n        steps { sh config.buildCmd ?: "mvn clean package" }\n      }\n      stage("Test") {\n        steps { sh config.testCmd ?: "mvn test" }\n      }\n      stage("Scan") {\n        steps {\n          withSonarQubeEnv("sonar") {\n            sh "mvn sonar:sonar"\n          }\n          waitForQualityGate abortPipeline: true\n        }\n      }\n    }\n  }\n}\n\n// Jenkinsfile (in app repo)\n@Library("my-lib") _\nstandardPipeline(buildCmd: "gradle build")' },
      { title: 'Parallel Execution & Advanced Patterns', bullets: [
        'parallel { } block \u2014 run stages concurrently within a pipeline',
        'Stash/unstash \u2014 share files between stages on different agents',
        'input step \u2014 pause pipeline for manual approval',
        'Parametrized builds: parameters { choice, string, booleanParam }',
        'Lockable resources: lock("deploy-prod") { } for deployment coordination',
        'Matrix directive: run combinations like parallel + matrix in declarative',
      ], code: 'stage("Parallel Tests") {\n  parallel {\n    stage("Unit Tests") { steps { sh "mvn test -Punit" } }\n    stage("Integration") { steps { sh "mvn test -Pintegration" } }\n    stage("Lint") { steps { sh "mvn checkstyle:check" } }\n  }\n}\n\nstage("Approve Deploy") {\n  input {\n    message "Deploy to production?"\n    ok "Deploy"\n    submitter "admin,lead"\n  }\n}' },
    ],
    qa: [
      { q: 'Declarative vs Scripted Pipeline?', a: 'Declarative uses a structured pipeline {} block with fixed sections (agent, stages, post) \u2014 easier to read, syntax-validated by Jenkins, recommended for most use cases. Scripted is pure Groovy in a node {} block \u2014 maximum flexibility but harder to maintain and debug. Prefer Declarative; use Scripted only for complex dynamic pipelines that cannot be expressed declaratively.' },
      { q: 'How do you trigger Jenkins from a GitHub webhook?', a: 'Install GitHub plugin. In GitHub repo settings, add webhook: Payload URL = https://jenkins-url/github-webhook/, Content type = application/json. In Jenkins job config, check "GitHub hook trigger for GITScm polling". Jenkins receives POST on every push/PR event and triggers matching jobs. Use Multibranch Pipeline for automatic branch discovery.' },
      { q: 'What is a shared library and why use it?', a: 'A Git repo containing reusable Groovy code: vars/ for global pipeline steps, src/ for classes, resources/ for config files. Configure in Manage Jenkins > System. Import with @Library("name") _. Benefits: DRY pipelines across repos, centralized updates, enforced standards. A change to the shared library immediately applies to all pipelines that use it.' },
      { q: 'How do you handle secrets in Jenkins?', a: 'Store in Jenkins Credentials Store (never in Jenkinsfile or Git). Inject with withCredentials() \u2014 values are masked in console output and scoped to the block. Use folder-scoped credentials to limit blast radius. For cloud access, prefer short-lived tokens. Rotate credentials regularly. Enable the Audit Trail plugin to track credential usage.' },
      { q: 'How do you implement CI/CD pipeline-as-code?', a: 'Store Jenkinsfile in the application repo root. Use Multibranch Pipeline to auto-discover branches. Each branch/PR gets its own pipeline run. Combine with shared libraries for reusable stages. Benefits: pipeline changes are version-controlled, reviewed via PR, and tested alongside application code.' },
      { q: 'How do you scale Jenkins for large organizations?', a: 'Horizontal scaling: add agents (docker-based for isolation). Use Kubernetes plugin to dynamically provision agents as pods. Implement shared libraries for standardized pipelines. Use folder-based organization with scoped credentials. Configure distributed builds with labels for workload routing. Use build discarders to prevent disk bloat.' },
      { q: 'How do you implement deployment approval gates?', a: 'Use the input step in a Declarative Pipeline stage. Specify message, submitter (allowed users), and optional parameters. The pipeline pauses until an authorized user approves. Combine with the Lock Resources plugin for deployment coordination (only one deploy to prod at a time).' },
      { q: 'What is the difference between agent any, agent none, and agent { label "..." }?', a: 'agent any: runs on any available agent. agent none: no global agent; each stage must declare its own (useful for mixed environments). agent { label "docker" }: runs only on agents tagged "docker". agent { docker { image "node:18" } }: runs inside a Docker container on any agent. Use label-based routing for specialized workloads (GPU, Windows, private network).' },
    ],
    tip: 'Prefer Declarative pipelines in interviews \u2014 it signals best practices. Always mention shared libraries for enterprise scale. The combination of Jenkinsfile + Multibranch Pipeline + Shared Libraries is the gold standard for Jenkins CI/CD.',
  },

  // ============================================================
  // BUILD TOOLS
  // ============================================================
  {
    id: 'build', name: 'Build Tools', icon: 'hammer', cat: 'core',
    overview: 'Maven and Gradle compile code, manage dependencies, run tests, and package artifacts. Understanding lifecycle phases, dependency management, CI integration, and build optimization is key for Java-focused DevOps roles.',
    sections: [
      { title: 'Maven Lifecycle & Phases', bullets: [
        'Default lifecycle: validate \u2192 compile \u2192 test \u2192 package \u2192 verify \u2192 install \u2192 deploy',
        'Running mvn package executes all phases up to and including package',
        'Dependency scopes: compile (default), test, provided, runtime, system',
        'SNAPSHOT = in-development version (can change); RELEASE = immutable',
        'pom.xml: project model with dependencies, plugins, build config, profiles',
        'settings.xml: global config for mirrors, servers (credentials), proxies',
        'distributionManagement: defines where mvn deploy sends artifacts',
        'Multi-module projects: parent POM with <modules> for monorepo builds',
      ], code: 'mvn clean package                  # compile + test + jar\nmvn clean package -DskipTests      # skip tests for speed\nmvn dependency:tree                # full dependency tree\nmvn dependency:analyze             # find unused/undeclared deps\nmvn versions:display-dependency-updates\nmvn deploy -P production           # with profile\nmvn clean install -T 4             # parallel build (4 threads)\nmvn clean verify sonar:sonar       # include SonarQube scan' },
      { title: 'Gradle Fundamentals', bullets: [
        'build.gradle (Groovy) or build.gradle.kts (Kotlin DSL, type-safe)',
        'Tasks = unit of work (compileJava, test, jar) \u2014 more granular than Maven phases',
        'Incremental builds: only re-runs tasks with changed inputs/outputs',
        'Build cache: reuse outputs from previous builds (local or remote)',
        'Gradle Wrapper (gradlew): ensures consistent Gradle version across environments',
        'Gradle daemon: keeps JVM warm for faster subsequent builds',
        'Multi-project builds: settings.gradle includes subprojects',
        'Configuration-on-demand: only configure projects that are needed',
      ], code: './gradlew clean build              # full build\n./gradlew test --tests "*UserServiceTest*"\n./gradlew dependencies --configuration compileClasspath\n./gradlew bootJar                  # Spring Boot fat jar\n./gradlew build --build-cache      # enable build cache\n./gradlew tasks --all              # list all available tasks\n./gradlew build --scan             # generate build scan report' },
      { title: 'CI Integration & Optimization', bullets: [
        'Cache ~/.m2/repository (Maven) or ~/.gradle/caches (Gradle) between CI builds',
        'Maven: -T 4 or -T 1C for parallel module builds (1 thread per CPU core)',
        'Gradle: --parallel flag for parallel project execution',
        'Separate compile/test/package into distinct pipeline stages for granularity',
        'Use -DskipTests in non-test stages to save time',
        'Artifact promotion: SNAPSHOT \u2192 RELEASE should be gated by full pipeline pass',
        'Gradle remote build cache: share cache across CI agents for massive speedups',
        'Use Maven enforcer plugin to enforce Java version, dependency rules',
      ], code: '# GitHub Actions Maven CI example:\n- uses: actions/cache@v4\n  with:\n    path: ~/.m2/repository\n    key: ${{ runner.os }}-maven-${{ hashFiles("**/pom.xml") }}\n- run: mvn clean verify -T 1C -B    # batch mode + parallel\n\n# Gradle CI:\n- uses: actions/cache@v4\n  with:\n    path: |\n      ~/.gradle/caches\n      ~/.gradle/wrapper\n    key: ${{ runner.os }}-gradle-${{ hashFiles("**/*.gradle*") }}' },
    ],
    qa: [
      { q: 'What is the Maven build lifecycle?', a: 'A fixed sequence of phases: validate, compile, test, package, verify, install, deploy. Running any phase executes all prior phases. Plugin goals bind to specific phases (e.g., surefire:test binds to test phase). There are three built-in lifecycles: default (builds), clean (cleans), site (generates documentation).' },
      { q: 'Compile vs runtime vs provided scope?', a: 'Compile: needed to compile AND run (default, included in final artifact). Runtime: not needed to compile but needed at runtime (e.g., JDBC driver \u2014 code uses javax.sql interfaces, driver is loaded at runtime). Provided: needed to compile but NOT packaged (e.g., servlet-api in Tomcat, Lombok at compile time). Test: only for test compilation and execution.' },
      { q: 'How do you speed up Maven builds in CI?', a: 'Key optimizations: (1) Cache ~/.m2/repository between builds. (2) Use -T 4 or -T 1C for parallel module builds. (3) -DskipTests in non-test stages. (4) -B batch mode (non-interactive). (5) Separate compile/test/package into pipeline stages. (6) Use Maven daemon (mvnd) for persistent JVM. (7) Profile-based builds to skip unnecessary modules.' },
      { q: 'What is a BOM and why is it important?', a: 'Bill of Materials \u2014 a special POM that defines consistent dependency versions for a suite of libraries. Import in dependencyManagement with scope=import. Example: spring-boot-dependencies BOM ensures all Spring components use compatible versions. Prevents version conflicts in multi-module projects. Organizations often create internal BOMs for approved library versions.' },
      { q: 'Maven vs Gradle \u2014 when would you choose each?', a: 'Maven: simpler, convention-over-configuration, better for standardized Java projects, larger ecosystem of plugins, XML-based (verbose but predictable). Gradle: faster (incremental builds, build cache, daemon), more flexible (Groovy/Kotlin DSL), better for multi-project builds, required for Android. Choose Maven for simple Java services; Gradle for complex multi-module projects or when build performance is critical.' },
      { q: 'How do you manage dependency conflicts?', a: 'Maven: use mvn dependency:tree to visualize. Maven uses "nearest wins" strategy. Override with <dependencyManagement> in parent POM. Use <exclusions> to remove transitive dependencies. Gradle: use ./gradlew dependencies, then resolution strategies (force, failOnVersionConflict). Both: use BOMs for consistent versions across modules.' },
      { q: 'What is the Gradle wrapper and why is it important?', a: 'The wrapper (gradlew/gradlew.bat + gradle/wrapper/) ensures every developer and CI agent uses the exact same Gradle version. Committed to Git. No need to install Gradle globally. Version is pinned in gradle-wrapper.properties. Update with ./gradlew wrapper --gradle-version 8.5. Always use gradlew in CI, never a globally installed Gradle.' },
    ],
    tip: 'SNAPSHOT versions should never reach production. Artifact promotion (SNAPSHOT \u2192 RELEASE) should be gated by a fully passing pipeline including security scans. Mention this in interviews \u2014 it shows production awareness and DevSecOps thinking.',
  },

  // ============================================================
  // DOCKER
  // ============================================================
  {
    id: 'docker', name: 'Docker', icon: 'container', cat: 'core',
    overview: 'Docker packages applications into portable containers. DevOps interviews focus on Dockerfile optimization, multi-stage builds, networking, volumes, compose, security hardening, and image scanning.',
    sections: [
      { title: 'Dockerfile Best Practices', bullets: [
        'Multi-stage builds: separate build-time dependencies from runtime image',
        'Use minimal base images: alpine (5MB), distroless (no shell), -slim variants',
        'Layer ordering: least \u2192 most frequently changed (COPY requirements first, then code)',
        'Run as non-root: USER 1001 \u2014 never run containers as root in production',
        'Use .dockerignore: exclude node_modules, .git, build/, *.md, tests/',
        'Pin versions: FROM node:20.11-alpine3.18 \u2014 never use :latest',
        'Combine RUN commands with && to reduce layers; clean up in same layer',
        'Use COPY instead of ADD (ADD auto-extracts tarballs, has URL fetch \u2014 less predictable)',
        'HEALTHCHECK instruction: let Docker monitor container health',
      ], code: 'FROM maven:3.9-eclipse-temurin-21 AS builder\nWORKDIR /app\nCOPY pom.xml .\nRUN mvn dependency:go-offline          # cache deps layer\nCOPY src ./src\nRUN mvn clean package -DskipTests\n\nFROM eclipse-temurin:21-jre-alpine\nRUN addgroup -S app && adduser -S app -G app\nUSER app\nCOPY --from=builder /app/target/*.jar app.jar\nHEALTHCHECK --interval=30s --timeout=3s \\\n  CMD wget -qO- http://localhost:8080/health || exit 1\nENTRYPOINT ["java","-jar","app.jar"]' },
      { title: 'Networking & Storage', bullets: [
        'bridge: default network, isolated per container, DNS resolution by container name',
        'host: shares host network stack \u2014 no NAT overhead, container uses host ports directly',
        'overlay: multi-host networking for Docker Swarm / distributed apps',
        'Bind mount: maps host directory to container (-v /host:/container) \u2014 dev use case',
        'Named volume: Docker-managed, persists across container restarts (docker volume create)',
        'tmpfs: in-memory mount, cleared on stop \u2014 for secrets or temp processing',
        'docker network create app-net \u2014 custom bridge for service discovery',
        'Read-only mounts: -v /data:/data:ro prevents container from modifying host files',
      ], code: 'docker network create app-net\ndocker run -d --network app-net --name db \\\n  -v pgdata:/var/lib/postgresql/data \\\n  -e POSTGRES_PASSWORD=secret postgres:16-alpine\n\ndocker run -d --network app-net --name api \\\n  -p 8080:8080 --read-only \\\n  --tmpfs /tmp \\\n  -e DB_HOST=db myapp:latest\n\n# Containers on same network can resolve by name:\n# api can reach db at "db:5432"' },
      { title: 'Docker Compose', bullets: [
        'docker-compose.yml defines multi-container applications declaratively',
        'services, networks, volumes are the three top-level keys',
        'depends_on: controls startup order (but not readiness \u2014 use healthchecks)',
        'Environment variables: env_file: .env or environment: section',
        'Build context: build: ./app with Dockerfile specification',
        'Profiles: group optional services (e.g., debug tools, monitoring)',
        'docker compose up -d --build \u2014 build images and start detached',
        'docker compose logs -f api \u2014 follow logs for specific service',
      ], code: 'services:\n  api:\n    build: ./api\n    ports: ["8080:8080"]\n    environment:\n      DB_HOST: db\n      DB_PORT: 5432\n    depends_on:\n      db:\n        condition: service_healthy\n    networks: [app-net]\n\n  db:\n    image: postgres:16-alpine\n    volumes: [pgdata:/var/lib/postgresql/data]\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U postgres"]\n      interval: 10s\n      timeout: 5s\n    networks: [app-net]\n\nvolumes:\n  pgdata:\nnetworks:\n  app-net:' },
      { title: 'Security & Image Management', bullets: [
        'Non-root user: USER directive in Dockerfile (required for production)',
        'Read-only filesystem: docker run --read-only --tmpfs /tmp',
        'Drop all capabilities: --cap-drop ALL, then add only what is needed',
        'No privileged mode: --privileged gives full host access (never in prod)',
        'Scan images: trivy image myapp:latest (fail on HIGH/CRITICAL)',
        'Use signed images: Docker Content Trust (DOCKER_CONTENT_TRUST=1)',
        'Resource limits: --memory 512m --cpus 0.5 (prevent noisy neighbors)',
        'Secrets: use Docker secrets or mount from Vault \u2014 never bake into image',
        'Image tagging: use semantic versioning + git SHA, never :latest in production',
      ], code: '# Security-focused run command:\ndocker run -d \\\n  --name app \\\n  --read-only \\\n  --tmpfs /tmp:rw,noexec,nosuid \\\n  --cap-drop ALL \\\n  --security-opt no-new-privileges:true \\\n  --memory 512m \\\n  --cpus 0.5 \\\n  --pids-limit 100 \\\n  -p 8080:8080 \\\n  myapp:v1.2.3-abc1234\n\n# Scan image:\ntrivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest' },
    ],
    qa: [
      { q: 'CMD vs ENTRYPOINT?', a: 'ENTRYPOINT defines the executable; CMD provides default arguments. If both are set, CMD is appended to ENTRYPOINT. Use exec form (["java","-jar","app.jar"]) not shell form. Shell form wraps in /bin/sh -c which prevents SIGTERM from reaching your process, causing slow shutdowns in Kubernetes (pod waits full terminationGracePeriodSeconds before SIGKILL).' },
      { q: 'How do you reduce Docker image size?', a: 'Multi-stage builds (build stage with full SDK, runtime stage with JRE only). Minimal base images (alpine/distroless). .dockerignore to exclude unnecessary files. Combine RUN commands with && and clean up in same layer (apt-get install && rm -rf /var/lib/apt/lists/*). Use --no-cache flag for package managers. Result: images can go from 1GB to under 100MB.' },
      { q: 'How do you secure a Docker container?', a: 'Layered approach: (1) Non-root user (USER 1001). (2) Read-only filesystem (--read-only + tmpfs). (3) Drop all capabilities (--cap-drop ALL, add-cap specific). (4) No privileged mode. (5) Resource limits (memory, CPU, PIDs). (6) Scan images with Trivy in CI. (7) Use signed images. (8) No secrets in images. (9) --security-opt no-new-privileges.' },
      { q: 'What is a dangling image?', a: 'An image with <none>:<none> tag \u2014 leftover from rebuilds when a new image takes the same tag. The old image loses its tag but remains on disk. Clean with docker image prune. Dangling volumes (docker volume prune) are volumes no longer attached to any container. Regular cleanup prevents disk exhaustion on build servers.' },
      { q: 'Explain Docker networking modes.', a: 'bridge (default): isolated network per container, NAT to host, containers communicate by name on same network. host: shares host network stack, no isolation, best performance. overlay: multi-host networking for Swarm. none: no networking. macvlan: assigns MAC address, appears as physical device on network. For Kubernetes, Docker networking is replaced by CNI plugins.' },
      { q: 'How does Docker layer caching work?', a: 'Each Dockerfile instruction creates a layer. Docker caches layers and reuses them if the instruction and context have not changed. If any layer changes, all subsequent layers are rebuilt. This is why you should order instructions from least to most frequently changing: base image \u2192 system deps \u2192 app deps (package.json/pom.xml) \u2192 source code. Copying dependency files before source code maximizes cache hits.' },
      { q: 'How do you handle persistent data in Docker?', a: 'Named volumes (docker volume create) are the recommended approach: Docker manages storage, survives container removal, can be backed up. Bind mounts (-v /host:/container) map host directories \u2014 useful for development. tmpfs mounts are in-memory only. For databases in production, prefer managed services or use volumes with proper backup strategies. Never store data in the container writable layer.' },
      { q: 'What is the difference between COPY and ADD?', a: 'COPY simply copies files from build context into the image. ADD does everything COPY does plus: auto-extracts tar archives and can fetch URLs. Best practice: always use COPY unless you specifically need tar extraction. ADD from URLs is discouraged \u2014 use RUN curl instead for better caching control.' },
      { q: 'How do you debug a running container?', a: 'docker exec -it container bash (or sh for alpine). docker logs -f container for stdout/stderr. docker inspect container for full configuration. docker stats for resource usage. docker top container for running processes. For distroless/scratch images with no shell: use debug sidecar containers or docker cp to extract files.' },
    ],
    tip: 'Always use exec form for ENTRYPOINT: ["java","-jar","app.jar"]. Shell form runs through /bin/sh -c which prevents SIGTERM from reaching your process. In Kubernetes, this causes pods to always wait the full terminationGracePeriodSeconds before being killed.',
  },

  // ============================================================
  // KUBERNETES
  // ============================================================
  {
    id: 'k8s', name: 'Kubernetes', icon: 'network', cat: 'core',
    overview: 'Kubernetes orchestrates containers at scale. For SRE/senior DevOps roles, go deep on workload types, networking (Services, Ingress, NetworkPolicy), RBAC, health probes, resource management, troubleshooting, and high availability patterns.',
    sections: [
      { title: 'Core Workload Objects', bullets: [
        'Pod: smallest deployable unit \u2014 one or more containers sharing network namespace + storage',
        'Deployment: manages ReplicaSet, handles rolling updates and rollbacks declaratively',
        'StatefulSet: ordered, stable pod names (pod-0, pod-1), stable PVCs per pod \u2014 for databases, Kafka',
        'DaemonSet: one pod per node \u2014 log agents, monitoring, CNI plugins',
        'Job: run-to-completion; CronJob: scheduled batch tasks',
        'HPA (Horizontal Pod Autoscaler): scale replicas on CPU/mem/custom metrics',
        'VPA (Vertical Pod Autoscaler): adjusts resource requests/limits automatically',
        'PodDisruptionBudget: guarantee min available pods during voluntary disruptions',
      ], code: 'kubectl get pods -A -o wide          # all pods, all namespaces\nkubectl rollout status deploy/api\nkubectl rollout undo deploy/api      # rollback to previous\nkubectl rollout history deploy/api   # see revision history\nkubectl scale deploy/api --replicas=5\nkubectl set image deploy/api app=myapp:v2\nkubectl get events --sort-by=".lastTimestamp" -n prod\nkubectl top pods -n prod             # resource usage' },
      { title: 'Networking & Service Discovery', bullets: [
        'ClusterIP (default): internal-only stable DNS name (my-svc.my-ns.svc.cluster.local)',
        'NodePort: exposes on every node IP at port 30000-32767',
        'LoadBalancer: provisions cloud load balancer (ELB/ALB/NLB on AWS)',
        'Ingress: L7 HTTP/HTTPS routing with host/path rules, TLS termination',
        'NetworkPolicy: pod-to-pod firewall rules (requires CNI like Calico or Cilium)',
        'CoreDNS: cluster DNS \u2014 resolves service-name.namespace.svc.cluster.local',
        'Service mesh (Istio/Linkerd): mTLS, traffic splitting, observability, circuit breaking',
        'ExternalDNS: automatically creates DNS records for Services/Ingresses',
      ], code: 'kubectl get svc -A\nkubectl describe ingress my-ingress\nkubectl port-forward svc/api 8080:80  # local access to cluster service\nkubectl exec -it pod -- curl http://backend.default.svc.cluster.local\nkubectl get networkpolicy -n prod\n\n# Debug DNS:\nkubectl run dnsutils --image=busybox --rm -it -- nslookup api.prod.svc.cluster.local' },
      { title: 'Security: RBAC, ServiceAccounts & Secrets', bullets: [
        'RBAC: Role/ClusterRole define permissions; RoleBinding/ClusterRoleBinding assign them',
        'ServiceAccount: pod-level identity \u2014 each pod runs as a ServiceAccount',
        'Principle of least privilege: start with zero permissions, add minimum needed',
        'Liveness probe: restart container if fails (detects deadlocks/hangs)',
        'Readiness probe: remove from Service endpoints if fails (traffic routing)',
        'Startup probe: disable liveness during slow startup (databases, JVMs)',
        'Secrets: base64-encoded (NOT encrypted) \u2014 use External Secrets Operator or Vault',
        'Pod Security Standards: restricted, baseline, privileged \u2014 enforce security policies',
        'SecurityContext: runAsNonRoot, readOnlyRootFilesystem, allowPrivilegeEscalation: false',
      ], code: 'kubectl auth can-i get pods --as=system:serviceaccount:prod:api-sa\nkubectl create role reader --verb=get,list,watch --resource=pods\nkubectl create rolebinding api-reader --role=reader \\\n  --serviceaccount=prod:api-sa -n prod\n\n# Pod security context:\nspec:\n  securityContext:\n    runAsNonRoot: true\n    fsGroup: 1000\n  containers:\n  - securityContext:\n      allowPrivilegeEscalation: false\n      readOnlyRootFilesystem: true\n      capabilities:\n        drop: ["ALL"]' },
      { title: 'Resource Management & Scheduling', bullets: [
        'requests: guaranteed resources (scheduler uses these for placement decisions)',
        'limits: maximum resources (container killed/throttled if exceeded)',
        'QoS classes: Guaranteed (requests=limits), Burstable (requests<limits), BestEffort (no requests)',
        'LimitRange: enforce default/min/max resources per namespace',
        'ResourceQuota: cap total resource usage per namespace',
        'nodeSelector, nodeAffinity, podAffinity/antiAffinity: control placement',
        'Taints and tolerations: restrict which pods can schedule on specific nodes',
        'topologySpreadConstraints: distribute pods evenly across zones/nodes',
      ], code: 'resources:\n  requests:\n    cpu: 250m          # 0.25 CPU cores\n    memory: 256Mi      # guaranteed memory\n  limits:\n    cpu: 500m          # max 0.5 cores (throttled beyond)\n    memory: 512Mi      # OOM killed if exceeded\n\ntopologySpreadConstraints:\n- maxSkew: 1\n  topologyKey: topology.kubernetes.io/zone\n  whenUnsatisfiable: DoNotSchedule\n  labelSelector:\n    matchLabels:\n      app: api' },
      { title: 'Troubleshooting', bullets: [
        'kubectl describe pod \u2014 events, conditions, container states',
        'kubectl logs pod -c container --previous \u2014 logs from crashed container',
        'kubectl get events --sort-by=lastTimestamp \u2014 recent cluster events',
        'CrashLoopBackOff: container keeps crashing \u2014 check logs, command, probes',
        'Pending pods: insufficient resources, taints, or PVC not bound',
        'ImagePullBackOff: wrong image name, missing credentials, registry down',
        'kubectl debug \u2014 attach ephemeral debug container to running pod',
        'kubectl top pods/nodes \u2014 check actual resource usage vs requests/limits',
      ], code: 'kubectl describe pod failing-pod -n prod\nkubectl logs failing-pod --previous -n prod\nkubectl get events -n prod --sort-by=.lastTimestamp | tail -20\nkubectl top pods -n prod --sort-by=memory\nkubectl debug -it failing-pod --image=busybox --target=app\nkubectl run test --rm -it --image=busybox -- sh  # temp debug pod' },
    ],
    qa: [
      { q: 'What happens when a Pod crashes?', a: 'The kubelet restarts it with exponential backoff: 10s, 20s, 40s, up to 5 minutes (CrashLoopBackOff). Check logs with kubectl logs --previous. The Deployment ReplicaSet ensures the desired replica count is maintained. Debug by checking events (describe pod), container command, environment variables, and probe configuration.' },
      { q: 'Deployment vs StatefulSet?', a: 'Deployments: stateless apps, pods are interchangeable, random names (app-abc123), any PVC, parallel updates. StatefulSets: stateful apps, stable ordered names (pod-0, pod-1), dedicated PVC per pod, ordered startup/shutdown. Use StatefulSet for databases (Postgres, MySQL), message queues (Kafka), and distributed systems requiring stable identity.' },
      { q: 'Liveness vs Readiness vs Startup probes?', a: 'Liveness: "Is the container alive?" \u2014 failure triggers restart. Use for detecting deadlocks/hangs. Readiness: "Can it serve traffic?" \u2014 failure removes from Service endpoints (no restart). Use during initialization, dependency wait, or graceful shutdown. Startup: "Has it finished starting?" \u2014 disables liveness until success. Use for slow-starting apps (JVMs, databases). Misconfiguring these is the #1 K8s interview pitfall.' },
      { q: 'How do you ensure HA in Kubernetes?', a: 'Multi-replica Deployments (3+ replicas). PodDisruptionBudgets (minAvailable during voluntary disruptions). topologySpreadConstraints (spread across AZs). Pod anti-affinity (don\'t co-locate replicas). Readiness probes (prevent traffic to unready pods). HPA for demand-based scaling. Multi-AZ node groups. Multi-region for disaster recovery.' },
      { q: 'How do you handle secrets securely in Kubernetes?', a: 'Never store plain secrets in Git (base64 is encoding, not encryption). Options: (1) External Secrets Operator (syncs from Vault/AWS SM/Azure KV). (2) Sealed Secrets (encrypted in Git, decrypted only in cluster). (3) Vault Agent Injector (sidecar injects secrets at runtime). (4) CSI Secrets Driver (mount secrets as volumes). Use RBAC to restrict who can read Secrets.' },
      { q: 'Explain the difference between requests and limits.', a: 'Requests: guaranteed resources for scheduling \u2014 the scheduler uses requests to decide which node has capacity. Limits: maximum allowed \u2014 CPU is throttled at the limit; memory causes OOM kill if exceeded. Set requests = expected usage, limits = max burst. If requests = limits, the pod gets Guaranteed QoS class (highest priority, last to be evicted).' },
      { q: 'How do you troubleshoot a pod stuck in Pending state?', a: 'kubectl describe pod <name> \u2014 check Events section. Common causes: (1) Insufficient resources (no node has enough CPU/memory). (2) Taints on nodes without matching tolerations. (3) PVC not bound (storage class issue). (4) Node selector doesn\'t match any nodes. (5) Pod affinity/anti-affinity constraints unsatisfiable. Fix: add nodes, adjust resources, fix taints, check storage.' },
      { q: 'What is a Service Mesh and when do you need one?', a: 'A service mesh (Istio, Linkerd) adds a sidecar proxy to every pod that handles: mTLS encryption (zero-trust networking), traffic splitting (canary deployments), circuit breaking, retries, observability (distributed tracing), and rate limiting. You need one when: managing 50+ microservices, requiring zero-trust networking, or needing advanced traffic management without application code changes.' },
      { q: 'How does kubectl apply differ from kubectl create?', a: 'kubectl create is imperative: creates a resource, fails if it already exists. kubectl apply is declarative: creates if absent, updates if exists, tracks changes via last-applied-configuration annotation. Always use apply in production/GitOps workflows \u2014 it is idempotent and supports drift detection. kubectl apply -f manifests/ processes all YAML files in a directory.' },
    ],
    tip: 'Liveness vs Readiness is the #1 K8s interview trip-up. Liveness = restart the container. Readiness = remove from load balancer. A pod can be alive but not ready (still warming up). Misconfiguring them causes unnecessary restarts or traffic to unready pods.',
  },

  // ============================================================
  // HELM
  // ============================================================
  {
    id: 'helm', name: 'Helm', icon: 'ship', cat: 'core',
    overview: 'Helm is the package manager for Kubernetes. Charts bundle templated K8s manifests with versioning and lifecycle management (install/upgrade/rollback). Master chart structure, templating, values management, and CI/CD integration.',
    sections: [
      { title: 'Chart Structure & Templating', bullets: [
        'Chart.yaml: metadata (name, version, appVersion, dependencies)',
        'values.yaml: default configuration, overridden per environment',
        'templates/: Go-templated K8s manifests (deployment.yaml, service.yaml, ingress.yaml)',
        '_helpers.tpl: reusable named templates (labels, selectors, fullname)',
        '{{ .Values.image.tag }} \u2014 access values hierarchy',
        '{{ .Release.Name }}, {{ .Release.Namespace }} \u2014 built-in objects',
        '{{ include "mychart.labels" . }} \u2014 call named templates',
        'Conditionals: {{ if .Values.ingress.enabled }} and {{ range .Values.hosts }}',
      ], code: 'helm create myapp              # scaffold new chart\nhelm lint ./myapp              # validate chart syntax\nhelm template myapp ./myapp -f prod-values.yaml  # render locally\nhelm package ./myapp           # create .tgz archive\nhelm show values stable/nginx  # view default values of a chart' },
      { title: 'Lifecycle & Release Management', bullets: [
        'helm install <release> <chart> \u2014 first installation',
        'helm upgrade --install \u2014 idempotent: install if absent, upgrade if exists',
        'helm rollback <release> <revision> \u2014 revert to a previous revision',
        'helm history <release> \u2014 show all revisions with status',
        'helm uninstall <release> \u2014 delete release and all its K8s resources',
        'Hooks: pre-install, post-install, pre-upgrade, post-upgrade, pre-delete',
        'Release state stored as K8s Secrets in the target namespace',
        'helm diff plugin: preview changes before upgrading',
      ], code: 'helm upgrade --install myapp ./myapp \\\n  --namespace prod \\\n  --create-namespace \\\n  -f values-prod.yaml \\\n  --set image.tag=${BUILD_SHA} \\\n  --wait --timeout 5m \\\n  --atomic                     # auto-rollback on failure\n\nhelm rollback myapp 3          # rollback to revision 3\nhelm history myapp             # see all revisions' },
      { title: 'Dependencies & Chart Repositories', bullets: [
        'Chart.yaml dependencies: specify sub-charts with version ranges',
        'helm dependency update \u2014 download dependencies to charts/ directory',
        'Condition/tags: enable/disable sub-charts via values',
        'OCI registries: store charts in container registries (ECR, ACR, GCR)',
        'helm repo add/update/list \u2014 manage chart repositories',
        'Artifact Hub: public chart discovery (artifacthub.io)',
      ], code: '# Chart.yaml dependencies:\ndependencies:\n  - name: postgresql\n    version: "~12.0"\n    repository: "https://charts.bitnami.com/bitnami"\n    condition: postgresql.enabled\n\nhelm dependency update ./myapp\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm search repo bitnami/postgresql --versions' },
    ],
    qa: [
      { q: 'What is Helm and why use it?', a: 'Kubernetes package manager. Bundles related K8s manifests (Deployment, Service, ConfigMap, Ingress) into versioned charts with Go templating for environment-specific configuration. Benefits: one-command install/upgrade/rollback, release history, dependency management, and community charts for common software. Without Helm, you manage 10+ raw YAML files with no versioning or rollback.' },
      { q: 'How do you roll back a Helm release?', a: 'helm rollback <release> <revision>. Find revision numbers with helm history <release>. Helm stores release state as Kubernetes Secrets in the namespace, so rollback works even without re-running the CI pipeline. Use --atomic flag during upgrade to auto-rollback on failure.' },
      { q: 'values.yaml vs --set vs -f overrides.yaml?', a: 'values.yaml = defaults committed in the chart. -f overrides.yaml = environment-specific overrides (values-prod.yaml, values-staging.yaml). --set = inline overrides, highest precedence, typically for CI-injected values like image tags. Precedence: --set > -f file > values.yaml. Best practice: use -f for environment config, --set only for dynamic CI values.' },
      { q: 'What are Helm hooks?', a: 'Jobs that run at lifecycle events: pre-install (setup), post-install (smoke test), pre-upgrade (DB migration), post-upgrade (cache warm), pre-delete (backup). Defined by helm.sh/hook annotations on K8s resources. Hook weight controls execution order. Hook deletion policy controls cleanup. Common use: run database migrations before deploying new application version.' },
      { q: 'How do you manage multiple environments with Helm?', a: 'Create per-environment values files: values-dev.yaml, values-staging.yaml, values-prod.yaml. Each overrides defaults for that environment (replicas, resources, ingress hosts, image tags). Deploy with: helm upgrade --install -f values-prod.yaml. In GitOps, each environment directory has its own values file and ArgoCD Application pointing to it.' },
      { q: 'What is the --atomic flag?', a: 'helm upgrade --atomic automatically rolls back the release if the upgrade fails (timeout, failed health checks, etc.). Without --atomic, a failed upgrade leaves the release in a "failed" state requiring manual rollback. Always use --atomic in CI/CD pipelines for safe automated deployments.' },
      { q: 'How do you test Helm charts?', a: 'helm lint \u2014 validates chart syntax. helm template \u2014 renders templates locally without installing. helm test \u2014 runs test pods defined in templates/tests/. helm diff (plugin) \u2014 shows what would change before upgrading. Use chart-testing (ct) tool for CI: validates charts, runs lint, install, and test in Kind/minikube clusters.' },
    ],
    tip: 'Use helm upgrade --install --atomic in CI pipelines \u2014 it is idempotent and auto-rolls back on failure. This eliminates the need for separate install vs upgrade logic and ensures safe deployments.',
  },

  // ============================================================
  // ARGOCD
  // ============================================================
  {
    id: 'argocd', name: 'ArgoCD', icon: 'refresh-cw', cat: 'core',
    overview: 'ArgoCD is a GitOps continuous delivery tool for Kubernetes. It continuously syncs cluster state with Git declarations, making Git the single source of truth for all deployments. Master GitOps principles, sync strategies, and multi-environment promotion.',
    sections: [
      { title: 'GitOps Principles & Architecture', bullets: [
        'Declarative: desired state defined in Git as YAML, Helm charts, or Kustomize',
        'Versioned: Git history = complete deployment audit trail',
        'Automated: ArgoCD continuously polls Git and reconciles drift',
        'Self-healing: manual cluster changes are automatically reverted to match Git',
        'Separation of concerns: CI builds + pushes images; ArgoCD deploys to cluster',
        'No CI system has cluster credentials \u2014 ArgoCD pulls from Git (pull-based CD)',
        'Application CRD: defines source (Git repo + path) and destination (cluster + namespace)',
        'ApplicationSet: templated Applications for multi-cluster/multi-env management',
      ], code: 'argocd app create myapp \\\n  --repo https://github.com/org/gitops.git \\\n  --path apps/myapp/overlays/prod \\\n  --dest-server https://kubernetes.default.svc \\\n  --dest-namespace prod \\\n  --sync-policy automated \\\n  --auto-prune \\\n  --self-heal\n\nargocd app sync myapp\nargocd app diff myapp              # preview changes\nargocd app rollback myapp 3        # rollback to revision 3' },
      { title: 'Sync Strategies & Health', bullets: [
        'Sync status: Synced (cluster matches Git) / OutOfSync (drift detected)',
        'Health status: Healthy / Progressing / Degraded / Missing / Suspended',
        'Auto-sync: automatically applies Git changes (optional, careful in prod)',
        'Self-heal: reverts manual cluster changes to match Git declaration',
        'Prune: removes cluster resources that were deleted from Git',
        'Sync waves: control deployment order with argocd.argoproj.io/sync-wave annotation',
        'Sync hooks: PreSync (DB migration), Sync (deploy), PostSync (smoke test)',
        'Retry strategy: automatic retry on sync failures with backoff',
      ], code: '# Application manifest:\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: myapp\n  namespace: argocd\nspec:\n  source:\n    repoURL: https://github.com/org/gitops\n    path: apps/myapp/overlays/prod\n    targetRevision: main\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: prod\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true\n    retry:\n      limit: 3\n      backoff:\n        duration: 5s\n        maxDuration: 3m' },
      { title: 'Multi-Environment & App of Apps', bullets: [
        'Directory structure: apps/dev/, apps/staging/, apps/prod/ with Kustomize overlays',
        'Promotion via PR: CI updates image tag in staging, PR to promote to prod',
        'App of Apps pattern: root Application manages child Applications',
        'ApplicationSet: generate Applications dynamically from Git, clusters, or lists',
        'Image Updater: automatically updates image tags in Git when new images are pushed',
        'Notifications: Slack/email alerts on sync success, failure, or health changes',
      ], code: '# ApplicationSet for multi-environment:\napiVersion: argoproj.io/v1alpha1\nkind: ApplicationSet\nmetadata:\n  name: myapp\nspec:\n  generators:\n  - list:\n      elements:\n      - env: dev\n        namespace: dev\n      - env: staging\n        namespace: staging\n      - env: prod\n        namespace: prod\n  template:\n    spec:\n      source:\n        repoURL: https://github.com/org/gitops\n        path: apps/myapp/overlays/{{env}}' },
    ],
    qa: [
      { q: 'What is GitOps and how does ArgoCD implement it?', a: 'GitOps uses Git as the single source of truth for infrastructure and application state. ArgoCD implements this by: (1) Watching a Git repository for desired state (YAML/Helm/Kustomize). (2) Comparing desired state with actual cluster state. (3) Automatically or manually reconciling differences. (4) Self-healing drift. Rollback = git revert the commit.' },
      { q: 'Sync status vs health status?', a: 'Sync status: does the cluster match Git? (Synced = match, OutOfSync = drift). Health status: are the K8s resources themselves healthy? (Healthy, Progressing, Degraded, Missing). A resource can be Synced but Degraded (correctly deployed from Git but crashing). Always monitor both \u2014 Synced + Healthy is the goal state.' },
      { q: 'How do you handle secrets in GitOps?', a: 'Never commit plaintext secrets to Git (base64 is not encryption). Solutions: (1) External Secrets Operator: syncs secrets from Vault/AWS Secrets Manager at runtime. (2) Sealed Secrets: encrypted in Git, only the cluster can decrypt. (3) ArgoCD Vault Plugin: injects secrets during ArgoCD sync. (4) SOPS: encrypt secret values in YAML files using KMS keys.' },
      { q: 'How do you promote across environments?', a: 'Git-based promotion: separate directories per environment (apps/dev/, apps/staging/, apps/prod/). CI updates image tag in target environment\'s values file via Git commit. ArgoCD detects the change and syncs. Promotion to production = merge PR that updates prod values. Full audit trail via Git history.' },
      { q: 'What is the App of Apps pattern?', a: 'A root ArgoCD Application that manages child Application manifests stored in Git. When you add a new service, you add its Application YAML to the root app\'s directory \u2014 ArgoCD automatically creates and manages it. Benefits: single point of management, declarative application lifecycle, easy multi-service deployments.' },
      { q: 'How does ArgoCD compare to FluxCD?', a: 'Both are GitOps tools. ArgoCD: powerful UI, Application CRD model, sync waves, multi-cluster support, large community. FluxCD: lighter weight, uses native K8s controllers (Kustomize/Helm controllers), better GitOps toolkit composability, tighter integration with Flagger for progressive delivery. Choose ArgoCD for UI-driven visibility; FluxCD for lean, controller-based GitOps.' },
      { q: 'How do you handle database migrations in GitOps?', a: 'Use ArgoCD sync hooks with PreSync phase: a Job that runs database migrations before the application Deployment is updated. Set the hook deletion policy to clean up. Sync waves ensure the migration completes before the app starts. If migration fails, the sync fails and the app is not updated.' },
    ],
    tip: 'In interviews, clearly separate CI and CD roles: CI builds, tests, pushes image, and updates the image tag in the GitOps repo. ArgoCD handles deployment to Kubernetes. This clean separation is the essence of GitOps.',
  },

  // ============================================================
  // SONARQUBE
  // ============================================================
  {
    id: 'sonar', name: 'SonarQube', icon: 'search', cat: 'security',
    overview: 'SonarQube performs SAST (Static Application Security Testing) \u2014 analyzing source code for bugs, vulnerabilities, code smells, and security hotspots without running the application. Quality Gates block pipelines when standards are not met.',
    sections: [
      { title: 'Core Concepts & Metrics', bullets: [
        'SAST: static analysis of source code at rest (not running the application)',
        'Quality Gate: pass/fail threshold that blocks the CI pipeline',
        'Bug: code likely to cause incorrect runtime behavior',
        'Vulnerability: code pattern exploitable by an attacker',
        'Code Smell: maintainability issue (duplication, complexity, long methods)',
        'Security Hotspot: code that needs human review \u2014 may or may not be a vulnerability',
        'Coverage: % of code executed by unit tests (requires JaCoCo, pytest-cov, Istanbul)',
        'Technical Debt: estimated time to fix all code smells (expressed in days/hours)',
        'Duplications: copy-pasted code blocks that should be refactored',
      ], code: '# Maven integration:\nmvn clean verify sonar:sonar \\\n  -Dsonar.projectKey=myapp \\\n  -Dsonar.host.url=http://sonar:9000 \\\n  -Dsonar.login=${SONAR_TOKEN} \\\n  -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml\n\n# Jenkins integration:\nwithSonarQubeEnv("sonar") {\n  sh "mvn sonar:sonar"\n}\nwaitForQualityGate abortPipeline: true' },
      { title: 'Quality Profiles & Rules', bullets: [
        'Quality Profile: set of rules activated for a language (Java, Python, JS, etc.)',
        'Sonar way: default built-in profile \u2014 good starting point',
        'Custom profiles: extend Sonar way with organization-specific rules',
        'Rule severity: Blocker > Critical > Major > Minor > Info',
        'New Code period: analyze only changes since last version/branch point',
        'Branch analysis: scan feature branches and PRs before merge',
        'PR decoration: post analysis results as PR comments in GitHub/GitLab',
      ], code: '# sonar-project.properties (for non-Maven projects):\nsonar.projectKey=myapp\nsonar.sources=src\nsonar.tests=tests\nsonar.language=py\nsonar.python.coverage.reportPaths=coverage.xml\nsonar.qualitygate.wait=true\n\n# GitHub Actions:\n- uses: SonarSource/sonarqube-scan-action@v2\n  env:\n    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}\n    SONAR_HOST_URL: ${{ vars.SONAR_URL }}' },
    ],
    qa: [
      { q: 'What is a Quality Gate?', a: 'A set of conditions code must meet to proceed in the pipeline. Default conditions: no new bugs, no new vulnerabilities, coverage on new code > 80%, duplication < 3%. If any condition fails, the gate fails and the pipeline is blocked. The "New Code" period ensures you only gate on changes in the current branch/PR, not the entire codebase.' },
      { q: 'Bug vs Vulnerability vs Code Smell?', a: 'Bug: code likely to cause incorrect runtime behavior (null dereference, infinite loop). Vulnerability: security weakness exploitable by attackers (SQL injection pattern, hardcoded credentials). Code Smell: not broken but hurts maintainability (duplicated code, overly complex methods, naming issues). Security Hotspot: code that often leads to vulnerabilities but requires human review to determine.' },
      { q: 'How do you integrate SonarQube into a CI pipeline?', a: 'Jenkins: wrap scan in withSonarQubeEnv(), run mvn sonar:sonar, then waitForQualityGate(abortPipeline: true). GitHub Actions: use SonarSource/sonarqube-scan-action. GitLab CI: sonar-scanner CLI with project token. Key: configure a webhook from SonarQube to your CI system so Quality Gate results are pushed back, not polled.' },
      { q: 'What is technical debt?', a: 'SonarQube\'s estimate of the time needed to fix all code smells. Expressed in days/hours. A project with "10 days of debt" needs roughly 10 developer-days of cleanup. Helps teams quantify and prioritize maintainability work alongside feature development. Track debt ratio (debt time / development time) to monitor code health trends.' },
      { q: 'SAST vs DAST \u2014 what is the difference?', a: 'SAST (SonarQube, Semgrep, Checkmarx): analyzes source code without running it. Finds logic flaws, coding patterns, and potential vulnerabilities early in development. DAST (OWASP ZAP, Burp Suite): tests the running application via HTTP requests. Finds runtime issues, misconfigurations, and authentication flaws. Both are needed in a complete security pipeline \u2014 they catch different classes of issues.' },
      { q: 'How do you handle false positives in SonarQube?', a: 'Options: (1) Mark as "Won\'t Fix" or "False Positive" in the SonarQube UI (with justification). (2) Use //NOSONAR comment on the line (use sparingly, document why). (3) Customize Quality Profile to disable rules that produce too many false positives for your codebase. (4) Create rule exclusions for specific files/patterns. Always review false positives periodically \u2014 they may become real issues.' },
    ],
    tip: 'Always clarify that SonarQube does SAST (static analysis, not running code). For DAST (testing running apps), mention OWASP ZAP. For SCA (dependency scanning), mention Snyk or OWASP Dependency-Check. Knowing the distinction between SAST/DAST/SCA shows security depth.',
  },

  // ============================================================
  // OWASP / DEVSECOPS
  // ============================================================
  {
    id: 'owasp', name: 'OWASP / DevSecOps', icon: 'shield', cat: 'security',
    overview: 'DevSecOps integrates security into every CI/CD stage \u2014 "shift-left security." OWASP provides the industry-standard vulnerability taxonomy. Know the Top 10, one scanning tool per pipeline stage, and how to build a secure SDLC.',
    sections: [
      { title: 'OWASP Top 10 (2021)', bullets: [
        'A01 Broken Access Control: users accessing resources beyond their permissions',
        'A02 Cryptographic Failures: weak encryption, secrets in code/logs, plaintext transmission',
        'A03 Injection: SQL/NoSQL/OS command injection via unsanitized user input',
        'A04 Insecure Design: missing threat modeling, business logic flaws',
        'A05 Security Misconfiguration: default passwords, open ports, verbose errors, unnecessary features',
        'A06 Vulnerable & Outdated Components: libraries with known CVEs',
        'A07 Identification & Authentication Failures: weak passwords, missing MFA, session mismanagement',
        'A08 Software & Data Integrity Failures: untrusted CI/CD, unsigned updates',
        'A09 Security Logging & Monitoring Failures: insufficient audit trail, no alerting',
        'A10 Server-Side Request Forgery (SSRF): server fetches attacker-controlled URLs',
      ] },
      { title: 'DevSecOps Pipeline Stages', bullets: [
        'Pre-commit: Gitleaks / truffleHog \u2014 detect secrets before they enter Git',
        'SAST: SonarQube / Semgrep / Checkmarx \u2014 static code analysis',
        'SCA: OWASP Dependency-Check / Snyk / Dependabot \u2014 library CVE scanning',
        'Container scan: Trivy / Grype / Snyk Container \u2014 Docker image CVE scanning',
        'IaC scan: Checkov / tfsec / KICS \u2014 Terraform/CloudFormation misconfigurations',
        'DAST: OWASP ZAP / Burp Suite \u2014 test the running application',
        'Runtime: Falco / Sysdig \u2014 detect anomalous container behavior in production',
        'Compliance: Open Policy Agent (OPA) / Kyverno \u2014 enforce policies as code',
      ], code: '# Trivy image scan (fail pipeline on HIGH/CRITICAL):\ntrivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest\n\n# OWASP Dependency-Check (fail on CVSS >= 7):\nmvn org.owasp:dependency-check-maven:check -DfailBuildOnCVSS=7\n\n# Gitleaks (pre-commit secret scan):\ngitleaks detect --source . --exit-code 1\n\n# Checkov (IaC scan):\ncheckov -d ./terraform --framework terraform --check HIGH\n\n# OWASP ZAP (DAST baseline scan):\ndocker run -t owasp/zap2docker-stable zap-baseline.py -t https://myapp.com' },
      { title: 'Threat Modeling & Secure SDLC', bullets: [
        'STRIDE model: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation of Privilege',
        'Threat model at design phase \u2014 before writing code',
        'Principle of least privilege: minimum permissions everywhere (IAM, RBAC, network)',
        'Defense in depth: multiple security layers (WAF \u2192 network \u2192 app \u2192 data)',
        'Zero trust: never trust, always verify \u2014 even inside the network perimeter',
        'Security champions: developers trained as security advocates in each team',
        'Bug bounty programs: incentivize external security researchers to find vulnerabilities',
      ] },
    ],
    qa: [
      { q: 'Name 3 OWASP Top 10 vulnerabilities and their mitigations.', a: '(1) Injection: use parameterized queries/prepared statements, never concatenate user input into SQL/commands. (2) Broken Access Control: enforce server-side authorization, deny by default, check permissions at every API endpoint. (3) Vulnerable Components: automate SCA in CI (Snyk/Dependabot), set CVSS thresholds to fail builds, update dependencies regularly.' },
      { q: 'SAST vs DAST vs SCA \u2014 explain each.', a: 'SAST (Static Application Security Testing): analyzes source code without running it \u2014 SonarQube, Semgrep. Finds coding flaws early. DAST (Dynamic Application Security Testing): tests the running application via HTTP \u2014 OWASP ZAP, Burp Suite. Finds runtime/config issues. SCA (Software Composition Analysis): scans dependencies for known CVEs \u2014 Snyk, Dependabot. All three are needed for complete coverage.' },
      { q: 'How do you scan Docker images for vulnerabilities in CI?', a: 'Use Trivy: trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest. Exit code 1 fails the pipeline on HIGH/CRITICAL CVEs. Scan at build time (in CI) AND periodically in the registry (new CVEs are published daily). Also scan base images separately and rebuild when base image CVEs are found.' },
      { q: 'How do you handle a critical CVE discovered in production?', a: '(1) Assess: is the vulnerability reachable in your code path? (2) Mitigate immediately: WAF rule, network restriction, or feature toggle. (3) Patch: update library version, rebuild image, deploy through pipeline. (4) Verify: confirm CVE is resolved with scanner. (5) Post-mortem: add scanning rule to prevent recurrence, update dependency update policy. Use error budget to justify emergency change if needed.' },
      { q: 'What is "shift-left security"?', a: 'Moving security testing earlier in the development lifecycle: from production/staging (right) to development/commit (left). Pre-commit hooks catch secrets. SAST runs during CI. SCA flags vulnerable deps at PR time. The earlier you find issues, the cheaper they are to fix. A bug found in development costs 10x less than one found in production.' },
      { q: 'How do you prevent secrets from being committed to Git?', a: 'Pre-commit hooks with Gitleaks or truffleHog scan staged changes for patterns matching API keys, passwords, tokens. CI-level scanning catches anything that slips through. If a secret is committed: (1) Rotate the secret immediately. (2) Use BFG Repo-Cleaner to remove from Git history. (3) Force-push cleaned history. (4) Add the pattern to pre-commit configuration.' },
      { q: 'What is Infrastructure as Code (IaC) security scanning?', a: 'Tools like Checkov, tfsec, and KICS analyze Terraform, CloudFormation, and Kubernetes manifests for security misconfigurations before deployment: open security groups, unencrypted storage, missing logging, overly permissive IAM policies. Run in CI alongside application security scans. This prevents insecure infrastructure from being provisioned.' },
    ],
    tip: 'Structure your DevSecOps answer by pipeline stage: Gitleaks (pre-commit) \u2192 SonarQube (SAST) \u2192 Snyk (SCA) \u2192 Trivy (container) \u2192 Checkov (IaC) \u2192 ZAP (DAST) \u2192 Falco (runtime). This shows you think about security holistically, not just one tool.',
  },

  // ============================================================
  // JFROG ARTIFACTORY
  // ============================================================
  {
    id: 'jfrog', name: 'JFrog Artifactory', icon: 'package', cat: 'security',
    overview: 'Artifactory is a universal artifact repository manager. It stores build outputs (JARs, Docker images, npm packages, Helm charts) with version control, access control, and security scanning via Xray.',
    sections: [
      { title: 'Repository Types & Concepts', bullets: [
        'Local repository: stores artifacts you upload (your build outputs)',
        'Remote repository: proxy/cache for external registries (Maven Central, Docker Hub, npm)',
        'Virtual repository: aggregates local + remote under one URL (clients see single endpoint)',
        'Federated repository: multi-site replication across Artifactory instances',
        'Build info: metadata linking artifacts to the CI build that produced them',
        'Properties: tag artifacts with key-value metadata (git.commit, status=promoted)',
        'AQL (Artifactory Query Language): query artifacts by properties, date, path, size',
      ] },
      { title: 'Artifact Promotion & Xray', bullets: [
        'Promotion flow: dev-local \u2192 staging-local \u2192 prod-local (same binary, no rebuild)',
        'Promotion guarantees: the exact binary tested in staging is deployed to production',
        'Xray: deep recursive scanning of stored artifacts for CVEs and license violations',
        'Xray policies: block download if severity threshold is exceeded',
        'Xray watches: monitor specific repos/builds and alert on new vulnerabilities',
        'Release bundles: immutable, signed collections of artifacts for distribution',
      ], code: '# Promote artifact via REST API:\ncurl -X POST "${ARTIFACTORY_URL}/api/build/promote/myapp/42" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer ${TOKEN}" \\\n  -d \'{"status":"promoted","targetRepo":"prod-local","copy":true}\'\n\n# Maven deploy:\nmvn deploy -DaltDeploymentRepository=libs-release::default::${ARTIFACTORY_URL}/libs-release\n\n# Docker push:\ndocker tag myapp:latest ${ARTIFACTORY_URL}/docker-local/myapp:v1.2.3\ndocker push ${ARTIFACTORY_URL}/docker-local/myapp:v1.2.3' },
    ],
    qa: [
      { q: 'What is a virtual repository?', a: 'An aggregation of local and remote repositories under a single URL. Clients configure one endpoint; Artifactory searches local repos first (your builds), then remote repos (proxied external registries). Simplifies client configuration \u2014 no need to list multiple upstream sources. Also provides a caching layer for external dependencies.' },
      { q: 'How does artifact promotion work?', a: 'The same binary artifact moves through environments: dev-local \u2192 staging-local \u2192 prod-local without rebuilding. This guarantees bit-for-bit identical artifacts across environments. Promotion is typically triggered by CI pipeline success: after all tests and scans pass, the artifact is promoted via API call. This is a core DevOps principle \u2014 build once, deploy everywhere.' },
      { q: 'What is JFrog Xray?', a: 'Artifactory\'s integrated security and compliance scanner. Performs deep recursive scanning of stored artifacts \u2014 scans inside JARs, Docker layers, npm packages, etc. Identifies CVEs (with severity and fix versions) and license compliance issues. Policies can block artifact download if thresholds are breached. Watches continuously monitor repos for newly published CVEs.' },
      { q: 'How do you integrate Artifactory with Maven?', a: 'Set distributionManagement in pom.xml with Artifactory repo URL. Store credentials in settings.xml (injected via CI credentials store, never in source). Run mvn deploy to publish. For resolution, configure Artifactory virtual repo as a mirror in settings.xml. The Maven client only knows about one URL \u2014 Artifactory handles routing to local and remote repos.' },
      { q: 'How do you clean up old artifacts?', a: 'Artifactory provides retention policies and cleanup strategies: (1) Artifact cleanup policies based on age, download count, or properties. (2) AQL queries to find unused artifacts. (3) Scheduled cleanup jobs. (4) Keep only N latest versions. Best practice: retain production artifacts indefinitely, clean dev/staging artifacts after 30-90 days.' },
    ],
    tip: 'The key Artifactory concept: build once, promote everywhere. The same binary tested in staging goes to production \u2014 never rebuild per environment. This eliminates "works on my machine" failures and is a fundamental DevOps principle.',
  },

  // ============================================================
  // PROMETHEUS
  // ============================================================
  {
    id: 'prom', name: 'Prometheus', icon: 'bar-chart', cat: 'obs',
    overview: 'Prometheus is a pull-based metrics monitoring system. It scrapes /metrics endpoints, stores time-series data, evaluates alert rules, and routes alerts via Alertmanager. PromQL is the query language for dashboards and alerts.',
    sections: [
      { title: 'Metric Types & Instrumentation', bullets: [
        'Counter: monotonically increasing (http_requests_total, errors_total) \u2014 never decreases, resets on restart',
        'Gauge: goes up and down (memory_bytes, active_connections, temperature)',
        'Histogram: samples in configurable buckets (request_duration_seconds_bucket)',
        'Summary: calculates quantiles client-side (less flexible, prefer histograms)',
        'Labels: key-value pairs for dimensions (method="GET", status="200", path="/api")',
        'Naming convention: <namespace>_<name>_<unit> (http_request_duration_seconds)',
        'Never use rate() on a Gauge \u2014 it does not make mathematical sense',
        'Instrumentation: add /metrics endpoint to your application (client libraries for all languages)',
      ] },
      { title: 'PromQL Essentials', bullets: [
        'rate(http_requests_total[5m]) \u2014 per-second rate over 5 minutes (for counters)',
        'increase(http_requests_total[1h]) \u2014 total increase over 1 hour',
        'sum by (status_code) (rate(metric[5m])) \u2014 aggregate by label',
        'histogram_quantile(0.99, rate(duration_bucket[5m])) \u2014 p99 latency',
        'avg_over_time(cpu_usage[30m]) \u2014 time-averaged gauge value',
        'absent(up{job="api"}) \u2014 returns 1 if the target has disappeared',
        'topk(5, rate(http_requests_total[5m])) \u2014 top 5 by request rate',
        'Comparison: metric > 100 \u2014 filter to series where value exceeds threshold',
      ], code: '# Error rate as percentage:\nrate(http_requests_total{status=~"5.."}[5m])\n/ rate(http_requests_total[5m]) * 100\n\n# P99 latency:\nhistogram_quantile(0.99,\n  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))\n)\n\n# Alert rule:\n- alert: HighErrorRate\n  expr: |\n    rate(http_requests_total{status=~"5.."}[5m])\n    / rate(http_requests_total[5m]) > 0.05\n  for: 2m\n  labels:\n    severity: critical\n  annotations:\n    summary: "Error rate above 5% for {{ $labels.job }}"' },
      { title: 'Alertmanager & Service Discovery', bullets: [
        'Alertmanager: deduplicates, groups, routes, and silences alerts',
        'Routing tree: match alerts by labels, send to correct receiver (Slack, PagerDuty)',
        'Inhibition rules: suppress child alerts when parent is firing',
        'Silences: temporarily mute alerts during maintenance windows',
        'group_by: combine related alerts into a single notification',
        'Service discovery: Kubernetes (automatic), Consul, EC2, file-based, DNS',
        'Relabeling: transform labels during scrape (keep/drop targets, rename labels)',
        'Federation: hierarchical Prometheus for multi-cluster monitoring',
      ], code: '# alertmanager.yml:\nroute:\n  group_by: [alertname, namespace]\n  group_wait: 30s\n  group_interval: 5m\n  receiver: default\n  routes:\n  - match:\n      severity: critical\n    receiver: pagerduty\n  - match:\n      severity: warning\n    receiver: slack\n\nreceivers:\n- name: pagerduty\n  pagerduty_configs:\n  - service_key: <key>\n- name: slack\n  slack_configs:\n  - channel: "#alerts"\n    send_resolved: true' },
    ],
    qa: [
      { q: 'How does Prometheus scrape metrics?', a: 'Prometheus uses a pull model: it sends HTTP GET requests to each target\'s /metrics endpoint at a configurable interval (default 15s). Targets expose metrics in a specific text format. No agents needed \u2014 the application exposes metrics via a client library. Service discovery (Kubernetes, Consul, etc.) automatically finds new targets.' },
      { q: 'Counter vs Gauge \u2014 when do you use each?', a: 'Counter: value only goes up (resets to 0 on restart). Use for totals: requests, errors, bytes sent. Query with rate() to get per-second rate. Gauge: value goes up and down freely. Use for current state: memory usage, active connections, queue depth, temperature. Query with avg_over_time() or just raw value. Rule of thumb: if it can naturally decrease \u2192 Gauge; if it only resets on restart \u2192 Counter.' },
      { q: 'Write a PromQL query for error rate as a percentage.', a: 'rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100. This divides 5xx errors per second by total requests per second over a 5-minute window, then multiplies by 100 for percentage. The [5m] range selector smooths out spikes.' },
      { q: 'How do you prevent alert storms?', a: 'Multiple strategies: (1) for: duration \u2014 alert must fire continuously for N minutes before notifying. (2) group_by in Alertmanager \u2014 combine related alerts into one notification. (3) Inhibition rules \u2014 suppress child alerts when parent fires (e.g., suppress all pod alerts when node is down). (4) Silences \u2014 mute alerts during maintenance. (5) Throttling \u2014 rate-limit notifications per receiver.' },
      { q: 'What are the four golden signals for monitoring?', a: 'From the Google SRE book: (1) Latency \u2014 time to serve requests (distinguish successful vs failed). (2) Traffic \u2014 demand on the system (requests/sec). (3) Errors \u2014 rate of failed requests. (4) Saturation \u2014 how "full" the system is (CPU, memory, queue depth). Monitoring these four covers most operational concerns.' },
      { q: 'How do you calculate p99 latency with Prometheus?', a: 'histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m]))). This calculates the 99th percentile from histogram buckets. The "le" (less than or equal) label is required \u2014 it defines bucket boundaries. Bucket boundaries should be chosen based on expected latency distribution (e.g., 0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10 seconds).' },
      { q: 'How does Prometheus handle high availability?', a: 'Run two identical Prometheus servers scraping the same targets (no clustering needed). Use Alertmanager in HA mode (gossip protocol deduplicates alerts). For long-term storage, use Thanos or Cortex (query across multiple Prometheus instances, downsample, store in object storage). Prometheus itself is designed for reliability over consistency \u2014 it prioritizes local storage and operation.' },
    ],
    tip: 'Counter vs Gauge is the #1 Prometheus interview question. The four golden signals (Latency, Traffic, Errors, Saturation) is #2. Know how to write PromQL for error rates and percentiles.',
  },

  // ============================================================
  // GRAFANA
  // ============================================================
  {
    id: 'grafana', name: 'Grafana', icon: 'line-chart', cat: 'obs',
    overview: 'Grafana is the visualization and observability platform. It connects to Prometheus, Loki, Tempo, CloudWatch, and 100+ data sources to create unified dashboards, alerts, and log/trace exploration.',
    sections: [
      { title: 'Data Sources & Dashboards', bullets: [
        'Prometheus: metrics (most common pairing for infrastructure monitoring)',
        'Loki: logs with LogQL \u2014 label-indexed, much cheaper than Elasticsearch',
        'Tempo: distributed traces \u2014 correlate with logs and metrics',
        'CloudWatch / Azure Monitor / Datadog: cloud-native metrics integration',
        'Variables/Templates: dropdown selectors that filter all panels dynamically',
        'Annotations: mark events (deployments, incidents) on time-series graphs',
        'Dashboard rows: organize panels by section (Overview, Latency, Errors, Resources)',
        'Dashboard links: cross-reference related dashboards and external tools',
      ], code: '# LogQL examples (Grafana + Loki):\n{namespace="prod", app="api"} |= "ERROR"\n{app="api"} | json | status_code >= 500\nrate({app="api"} |= "ERROR" [5m])   # error rate from logs\n{app="api"} | json | line_format "{{.method}} {{.path}} {{.status}}"' },
      { title: 'Alerting & Dashboard-as-Code', bullets: [
        'Unified alerting: evaluate PromQL, LogQL, or any data source query',
        'Alert rules: query + threshold + for duration + labels',
        'Contact points: Slack, PagerDuty, email, webhook, Teams, OpsGenie',
        'Notification policies: route alerts to contact points by labels',
        'Grafana as Code: export dashboard JSON, store in Git',
        'Provisioning: mount dashboards via ConfigMaps (Kubernetes sidecar)',
        'Grafana Terraform provider: manage dashboards, folders, alerting as IaC',
        'Grafana OnCall: incident management integrated with alerting',
      ], code: '# Dashboard provisioning (Kubernetes):\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: grafana-dashboard-api\n  labels:\n    grafana_dashboard: "1"  # sidecar picks this up\ndata:\n  api-dashboard.json: |\n    { "dashboard": { ... }, "overwrite": true }' },
    ],
    qa: [
      { q: 'How do you create a Grafana dashboard from Prometheus?', a: 'Add Prometheus as a data source (Settings > Data Sources, enter Prometheus URL). Create a new dashboard, add a panel, write a PromQL query (e.g., rate(http_requests_total[5m])), choose visualization type (time series, gauge, stat, table). Add template variables using label_values() queries so one dashboard works across all environments and services.' },
      { q: 'What are Grafana template variables?', a: 'Variables are dropdowns at the top of a dashboard that inject values into all panel queries. Created from a data source query (e.g., label_values(up, namespace) for a namespace selector). Types: query, custom, constant, interval. Makes dashboards reusable across services and environments. Users can switch context without editing queries.' },
      { q: 'Grafana Loki vs Elasticsearch for logs?', a: 'Loki: only indexes labels (not full log content), stores logs in object storage (S3/GCS), much cheaper at scale, LogQL is PromQL-inspired. Elasticsearch: full-text indexes everything, powerful search capabilities, but expensive in storage and compute. Use Loki for operational logs and cost efficiency. Use Elasticsearch when you need full-text search, complex aggregations, or compliance requirements.' },
      { q: 'How do you manage dashboards as code?', a: 'Export dashboards as JSON from Grafana UI. Store JSON files in Git. Deploy via: (1) Kubernetes ConfigMaps with grafana-dashboard-provider sidecar. (2) Terraform grafana provider for full lifecycle management. (3) Grafana API for programmatic updates. This enables version-controlled, reviewable, GitOps-deployed dashboards.' },
      { q: 'What is Grafana Tempo and why is distributed tracing important?', a: 'Tempo is a distributed tracing backend that stores and queries traces (compatible with Jaeger, Zipkin, OpenTelemetry). Distributed tracing follows a single request across multiple services, showing latency per service, error locations, and dependency relationships. Essential for debugging microservices \u2014 when a request is slow, tracing shows exactly which service caused the delay.' },
      { q: 'How do you set up alerting in Grafana?', a: 'Define alert rules (Alerting > Alert rules): select data source, write query, set threshold condition and "for" duration. Configure contact points (Slack, PagerDuty, email). Create notification policies to route alerts by label (severity, team). Set grouping, wait, and interval. Enable "send resolved" so teams know when issues clear.' },
    ],
    tip: 'Dashboard-as-code: export Grafana dashboards as JSON, store in Git, deploy via ConfigMaps or Terraform. This enables version-controlled, GitOps-deployed observability. Mention this in interviews to show SRE maturity.',
  },

  // ============================================================
  // SPLUNK
  // ============================================================
  {
    id: 'splunk', name: 'Splunk', icon: 'telescope', cat: 'obs',
    overview: 'Splunk is an enterprise log management and SIEM platform. It indexes machine data at scale and enables search, alerting, dashboards, and security analytics via SPL (Search Processing Language).',
    sections: [
      { title: 'Architecture', bullets: [
        'Universal Forwarder (UF): lightweight agent, tails log files, sends raw data',
        'Heavy Forwarder (HF): full processing, parses/filters before sending (reduces indexer load)',
        'Indexer: parses events, extracts fields, stores in time-based buckets',
        'Search Head: web UI, SPL execution, dashboard rendering',
        'Deployment Server: centrally manage forwarder configurations at scale',
        'Cluster: indexer cluster (data replication) + search head cluster (HA search)',
        'Hot \u2192 Warm \u2192 Cold \u2192 Frozen bucket lifecycle based on data age',
        'License: based on daily ingestion volume (expensive at scale)',
      ] },
      { title: 'SPL Essentials', bullets: [
        'Pipeline model: search | command1 | command2 | command3',
        'stats count by field \u2014 aggregate counts grouped by field',
        'eval newfield=expression \u2014 compute derived fields',
        'rex field=_raw "pattern(?<name>...)" \u2014 regex field extraction',
        'timechart span=5m count by field \u2014 time-bucketed visualization',
        'top N field \u2014 most frequent values',
        'where \u2014 filter results: | where status_code >= 500',
        'transaction \u2014 group events into transactions by field or time',
        'lookup \u2014 enrich events with external reference data (CSV files)',
      ], code: '# Error count by host:\nindex=prod sourcetype=app_logs level=ERROR\n| stats count by host\n| sort -count\n\n# Response time analysis:\nindex=nginx\n| rex field=_raw \'"(?P<method>\\w+) (?P<uri>[^ ]+).*" (?P<status>\\d+) .* (?P<rt>[\\d.]+)\'\n| timechart span=5m avg(rt) as avg_response_time by method\n\n# Top slow endpoints:\nindex=main earliest=-24h\n| stats avg(response_time) as avg_rt p99(response_time) as p99_rt count by endpoint\n| sort -p99_rt\n| head 10' },
    ],
    qa: [
      { q: 'Universal vs Heavy Forwarder?', a: 'Universal Forwarder (UF): lightweight (50MB), tails log files, sends raw data with minimal processing \u2014 used on most servers. Heavy Forwarder (HF): full Splunk instance, can parse, filter, route, and mask data before forwarding \u2014 used when you need to reduce volume, parse at the edge, or anonymize data before it reaches indexers.' },
      { q: 'Write SPL to find top 5 error-producing hosts.', a: 'index=prod sourcetype=app level=ERROR | stats count by host | sort -count | head 5. This filters errors from the prod index, counts per host, sorts descending, and takes the top 5. Add | timechart span=5m count by host to visualize the trend over time.' },
      { q: 'How does Splunk index data?', a: 'Forwarder sends data to indexer. Indexer: (1) Parses events (breaks raw data into events using line breaking/timestamp rules). (2) Extracts fields (timestamp, source, sourcetype, host + search-time fields). (3) Writes to time-based buckets on disk: hot (actively written) \u2192 warm (read-only, local) \u2192 cold (read-only, archive) \u2192 frozen (deleted or archived to external storage).' },
      { q: 'Splunk vs Loki vs Elasticsearch for logging?', a: 'Splunk: enterprise SIEM, full-featured, compliance/forensics, excellent search, very expensive. Elasticsearch (ELK): full-text indexing, powerful aggregations, moderate cost, good for search-heavy use cases. Loki: label-indexed only, cheapest (object storage), lightweight, PromQL-inspired. Choose Splunk for enterprise security/compliance; ELK for full-text search; Loki for operational logs at scale.' },
      { q: 'How do you create a Splunk alert?', a: 'Create a saved search with your SPL query. Set a schedule (e.g., every 5 minutes). Configure trigger conditions (e.g., when results > 0, or when count > 100). Choose alert actions: send email, Slack webhook, PagerDuty, run a script, or create a notable event (for ES). Enable throttling to prevent alert storms.' },
    ],
    tip: 'Distinguish Splunk from Loki in interviews: Splunk is a full SIEM platform with compliance/forensics and enterprise support \u2014 justified for organizations with security/audit requirements. Loki is lightweight and cheap but lacks SIEM features.',
  },

  // ============================================================
  // AWS
  // ============================================================
  {
    id: 'aws', name: 'AWS', icon: 'cloud', cat: 'cloud',
    overview: 'AWS is the dominant cloud provider. Focus on compute (EC2/ECS/EKS), networking (VPC/SG/NACL), IAM (roles/IRSA), storage (S3/EBS/EFS), and high-availability architectural patterns.',
    sections: [
      { title: 'Networking (VPC, SG, NACL)', bullets: [
        'VPC: isolated virtual network with a CIDR block (e.g., 10.0.0.0/16)',
        'Public subnet: has route to Internet Gateway (for ALB, NAT, bastion)',
        'Private subnet: no direct internet route (app servers, databases, EKS nodes)',
        'NAT Gateway: allows private subnet outbound internet (no inbound)',
        'Security Group: stateful firewall at ENI/instance level, allow-only rules',
        'NACL: stateless firewall at subnet level, allow + deny rules, evaluated in order',
        'VPC Peering / Transit Gateway: connect VPCs (same or cross-account/region)',
        'PrivateLink: access AWS services without internet (S3, ECR, STS endpoints)',
        'Route 53: DNS service with health checks and routing policies (weighted, failover, latency)',
      ], code: 'aws sts get-caller-identity\naws ec2 describe-instances --filters "Name=tag:Env,Values=prod"\naws ec2 describe-security-groups --group-ids sg-xxx\naws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-xxx"\naws route53 list-hosted-zones' },
      { title: 'IAM, EKS & Compute', bullets: [
        'IAM Role: temporary credentials assumed by services/users (no long-lived keys)',
        'Least privilege: start with no permissions, add only what is needed',
        'IRSA: annotate K8s ServiceAccount with IAM role ARN via OIDC federation',
        'EKS: managed K8s control plane, you manage worker nodes (or use Fargate)',
        'EKS managed node groups: AWS handles node lifecycle, AMI updates',
        'Fargate: serverless pods \u2014 no node management, pay per pod',
        'Instance profiles: attach IAM roles to EC2 instances',
        'SSM Session Manager: SSH alternative \u2014 no open ports, audit logged',
        'Auto Scaling Groups: maintain desired capacity, replace unhealthy instances',
      ], code: '# Assume role:\naws sts assume-role \\\n  --role-arn arn:aws:iam::123456:role/MyRole \\\n  --role-session-name debug-session\n\n# EKS:\naws eks update-kubeconfig --name mycluster --region us-east-1\nkubectl get nodes\n\n# IRSA annotation:\nkubectl annotate sa myapp \\\n  eks.amazonaws.com/role-arn=arn:aws:iam::123:role/myrole' },
      { title: 'Storage & High Availability', bullets: [
        'S3: object storage, unlimited scale, 99.999999999% (11 nines) durability',
        'EBS: block storage, single EC2 attachment (gp3 for general, io2 for high IOPS)',
        'EFS: managed NFS, multi-AZ, concurrent access from multiple EC2/EKS',
        'RDS Multi-AZ: synchronous replication, automatic failover for databases',
        'ElastiCache: managed Redis/Memcached for caching and session storage',
        'ALB: Application Load Balancer (L7 HTTP/HTTPS, path/host routing)',
        'NLB: Network Load Balancer (L4 TCP/UDP, ultra-low latency)',
        'CloudFront: CDN for static assets and API acceleration',
      ], code: 'aws s3 ls s3://mybucket --recursive --human-readable\naws s3 sync ./dist s3://mybucket --delete\naws rds describe-db-instances\naws elbv2 describe-target-health --target-group-arn arn:...' },
    ],
    qa: [
      { q: 'Security Group vs NACL?', a: 'Security Group: stateful (return traffic auto-allowed), applied per ENI/instance, allow-only rules, all rules evaluated. NACL: stateless (must allow both inbound and outbound explicitly), applied per subnet, allow and deny rules, evaluated in number order (first match wins). Use SGs as primary defense; NACLs for coarse subnet-level blocking.' },
      { q: 'How does IRSA work?', a: 'EKS creates an OIDC identity provider. You create an IAM role with a trust policy allowing the OIDC provider + specific ServiceAccount. Annotate the K8s ServiceAccount with the IAM role ARN. Pods using that SA automatically get temporary AWS credentials scoped to the IAM role. No node-level permissions needed \u2014 least privilege at the pod level.' },
      { q: 'How do you design a highly available architecture on AWS?', a: 'Multi-AZ deployment: ALB + Auto Scaling Group across 3 AZs. RDS Multi-AZ for database failover. ElastiCache for stateless sessions. S3 for shared assets (inherently multi-AZ). Route 53 health checks with DNS failover. For DR: multi-region with Route 53 latency routing. EKS: multi-AZ node groups + PodDisruptionBudgets.' },
      { q: 'EBS vs EFS vs S3 \u2014 when do you use each?', a: 'EBS: block storage, single EC2 attachment, lowest latency \u2014 databases, OS volumes. EFS: managed NFS, multi-EC2/EKS mount simultaneously \u2014 shared config, CMS content, ML training data. S3: object storage, unlimited scale, HTTP accessible \u2014 backups, static assets, data lake, artifacts. Rule: EBS for single-instance performance, EFS for shared access, S3 for everything else.' },
      { q: 'What is the difference between ALB and NLB?', a: 'ALB (Application Load Balancer): L7 HTTP/HTTPS, path-based and host-based routing, WebSocket support, WAF integration, slowest but most featured. NLB (Network Load Balancer): L4 TCP/UDP, ultra-low latency, static IP, handles millions of requests/sec. Use ALB for web apps and APIs. Use NLB for non-HTTP protocols, extreme performance, or when you need static IPs.' },
      { q: 'How do you secure an S3 bucket?', a: 'Block public access (account-level and bucket-level settings). Bucket policy for fine-grained access control. IAM policies for user/role-based access. Enable server-side encryption (SSE-S3, SSE-KMS, or SSE-C). Enable versioning for accidental deletion protection. Enable access logging. Use VPC endpoints (PrivateLink) to avoid internet exposure. Enable MFA delete for critical buckets.' },
      { q: 'What is AWS Organizations and how does it help security?', a: 'AWS Organizations manages multiple AWS accounts centrally. Service Control Policies (SCPs) set permission guardrails across all accounts. Separate accounts for dev/staging/prod provide blast radius isolation. Consolidated billing for cost management. AWS Control Tower automates account setup with best practices. This is the enterprise standard for AWS governance.' },
    ],
    tip: 'IRSA is the AWS best practice for EKS workloads needing AWS access. Never assign broad IAM roles to EC2 nodes \u2014 it violates least privilege. IRSA provides per-pod credential scoping. Mention this to show you understand modern AWS security patterns.',
  },

  // ============================================================
  // AZURE
  // ============================================================
  {
    id: 'azure', name: 'Azure', icon: 'hexagon', cat: 'cloud',
    overview: "Azure is Microsoft's cloud platform. Focus on AKS, networking (VNet/NSG/App Gateway), identity (Managed Identity/Workload Identity), and the DevOps toolchain (Azure DevOps, ACR, Key Vault).",
    sections: [
      { title: 'AKS & Networking', bullets: [
        'AKS: managed K8s, control plane is free, pay only for worker nodes',
        'Node pools: system pool (system pods) + user pools (app workloads, GPU, spot)',
        'Azure CNI: pods get real VNet IPs (routable, better performance, more IP usage)',
        'Kubenet: pods get overlay IPs behind NAT (simpler, fewer IPs consumed)',
        'NSG: stateful L4 firewall on NIC or subnet (equivalent to AWS Security Groups)',
        'Application Gateway: L7 HTTP/HTTPS routing, WAF v2, SSL termination, autoscaling',
        'Azure Front Door: global CDN + WAF + load balancing across regions',
        'Private Link: access Azure services privately without internet exposure',
        'VNet peering: connect VNets within or across regions',
      ] },
      { title: 'Identity & Security', bullets: [
        'Managed Identity: Azure-assigned credentials, no secrets to manage',
        'System-assigned: tied to resource lifecycle (deleted when resource is deleted)',
        'User-assigned: independent lifecycle, shareable across multiple resources',
        'Workload Identity: AKS pod-level identity via OIDC federation (modern, replaces AAD Pod Identity)',
        'Entra ID (formerly Azure AD): identity provider for Azure, M365, and custom apps',
        'Azure RBAC: controls access to Azure resources (Reader, Contributor, Owner, custom)',
        'Key Vault: centralized secrets, keys, and certificate management',
        'Azure Policy: enforce compliance rules across subscriptions (like AWS SCPs)',
      ], code: '# Managed Identity:\naz vm identity assign --name myvm --resource-group myrg\n\n# AKS Workload Identity:\naz identity federated-credential create \\\n  --name myapp \\\n  --identity-name myapp-identity \\\n  --resource-group myrg \\\n  --issuer ${AKS_OIDC_ISSUER} \\\n  --subject system:serviceaccount:mynamespace:myapp-sa\n\n# Key Vault secret:\naz keyvault secret set --vault-name myvault --name db-password --value "secret123"\naz keyvault secret show --vault-name myvault --name db-password' },
    ],
    qa: [
      { q: 'Azure RBAC vs Entra ID roles?', a: 'Azure RBAC controls access to Azure resources (VMs, storage, AKS, subscriptions) \u2014 who can manage infrastructure. Entra ID roles control identity and directory operations (manage users, groups, app registrations, conditional access) \u2014 who can manage identity. They are separate systems. A user can be Contributor (Azure RBAC) and User Administrator (Entra ID) simultaneously.' },
      { q: 'Managed Identity vs Service Principal?', a: 'Managed Identity: Azure manages the credentials automatically, no rotation needed, no leak risk, tied to Azure resources. Service Principal: you explicitly create an app registration with a client secret or certificate that you must manage and rotate. Always prefer Managed Identity for Azure-to-Azure authentication. Use Service Principal only for external systems that cannot use Managed Identity.' },
      { q: 'Azure Load Balancer vs Application Gateway?', a: 'Azure Load Balancer: L4 TCP/UDP, no HTTP awareness, cheapest, fastest, supports HA ports. Application Gateway: L7 HTTP/HTTPS, URL-based routing, host-based routing, WAF v2, SSL offloading, autoscaling. Use LB for non-HTTP workloads or internal TCP services. Use App Gateway when you need HTTP routing, WAF, or SSL termination.' },
      { q: 'Azure CNI vs Kubenet in AKS?', a: 'Azure CNI: pods get real VNet IPs, directly routable from VNet, better performance, required for Windows nodes and Azure Network Policies. Downside: consumes more IP addresses. Kubenet: pods get overlay IPs (10.244.x.x), NAT to node IP, more pods per node with fewer IPs. Use Azure CNI for production (better networking); Kubenet for dev/test or when IP space is limited.' },
      { q: 'What is Workload Identity and why is it important?', a: 'Workload Identity is the modern AKS solution for pod-level Azure authentication (replacing deprecated AAD Pod Identity). It uses OIDC federation between AKS and Entra ID: AKS issues OIDC tokens, Entra ID trusts them and exchanges for Azure credentials. Analogous to AWS IRSA. Per-pod identity without node-level credentials. Always use this for AKS workloads needing Azure access.' },
      { q: 'How do you manage secrets in Azure?', a: 'Azure Key Vault is the central secrets store. Access via: (1) Managed Identity + Azure SDK in application code. (2) CSI Secrets Driver for Kubernetes (mount secrets as volumes). (3) External Secrets Operator (sync to K8s Secrets). (4) Azure DevOps variable groups linked to Key Vault. Never store secrets in environment variables, config files, or Git. Enable soft delete and purge protection on Key Vault.' },
    ],
    tip: 'Workload Identity is the modern AKS pod identity solution. It uses OIDC federation between AKS and Entra ID \u2014 analogous to AWS IRSA. Mentioning this shows you are current with Azure best practices.',
  },

  // ============================================================
  // SRE CONCEPTS
  // ============================================================
  {
    id: 'sre', name: 'DevOps / SRE Concepts', icon: 'target', cat: 'core',
    overview: 'SRE applies software engineering to operations. SLOs, error budgets, toil reduction, incident management, and deployment strategies are the conceptual frameworks that senior DevOps/SRE interviewers probe deeply.',
    sections: [
      { title: 'SLI / SLO / SLA / Error Budgets', bullets: [
        'SLI (Service Level Indicator): the metric you measure \u2014 % successful requests, p99 latency',
        'SLO (Service Level Objective): your internal target \u2014 "maintain 99.9% success rate"',
        'SLA (Service Level Agreement): external contract with penalties \u2014 "guarantee 99.5% uptime"',
        'Error budget = 1 - SLO = 0.1% = 43.8 minutes/month of allowed downtime',
        'Healthy budget: deploy features freely, take calculated risks',
        'Exhausted budget: freeze non-critical changes, focus on reliability',
        'Burn rate: how fast you are consuming error budget (2x burn = exhausting 2x faster)',
        'SLO \u2265 SLA: your internal target must be stricter than the customer contract',
      ], code: '# Burn rate alert (consuming budget 14x faster than sustainable):\n# This multi-window approach reduces alert noise:\n- alert: HighBurnRate\n  expr: |\n    (\n      rate(http_requests_total{status=~"5.."}[1h])\n      / rate(http_requests_total[1h])\n    ) > 14 * (1 - 0.999)\n    and\n    (\n      rate(http_requests_total{status=~"5.."}[5m])\n      / rate(http_requests_total[5m])\n    ) > 14 * (1 - 0.999)\n  for: 2m\n  labels:\n    severity: critical' },
      { title: 'Deployment Strategies', bullets: [
        'Rolling update: replace pods gradually (default K8s), zero downtime, medium risk',
        'Blue-Green: two full environments, instant LB switch, instant rollback, doubles infra cost',
        'Canary: gradual traffic shift (5% \u2192 25% \u2192 100%), minimal blast radius, needs traffic splitting',
        'Recreate: kill all old, start all new \u2014 has downtime, simplest strategy',
        'A/B testing: route by user segment for feature experimentation',
        'Feature flags: decouple deployment from release \u2014 deploy code, enable later',
        'Shadow/dark launch: send production traffic to new version without serving responses',
      ] },
      { title: 'Incident Management & Reliability', bullets: [
        'MTTR (Mean Time To Recover): incident detection \u2192 resolution',
        'MTTD (Mean Time To Detect): failure occurs \u2192 alert fires',
        'MTBF (Mean Time Between Failures): average uptime between incidents',
        'Blameless post-mortem: focus on systems and processes, not individuals',
        'Post-mortem structure: timeline, root cause (5 Whys), impact, action items with owners',
        'Toil: manual, repetitive, automatable work that scales with service growth',
        'SRE goal: keep toil below 50% of time; rest spent on engineering improvements',
        'Runbook automation: codify operational procedures into executable scripts',
        'Chaos engineering: intentionally inject failures to test resilience (Chaos Monkey, Litmus)',
      ] },
      { title: 'Observability Pillars', bullets: [
        'Metrics: numerical measurements over time (Prometheus, CloudWatch) \u2014 what is happening',
        'Logs: discrete events with context (Loki, Splunk, ELK) \u2014 why it happened',
        'Traces: request flow across services (Tempo, Jaeger) \u2014 where it happened',
        'Correlation: link metrics \u2192 logs \u2192 traces for fast root cause analysis',
        'RED method: Rate, Errors, Duration \u2014 for request-driven services',
        'USE method: Utilization, Saturation, Errors \u2014 for infrastructure resources',
        'Four golden signals: Latency, Traffic, Errors, Saturation (Google SRE)',
      ] },
    ],
    qa: [
      { q: 'Explain the difference between SLI, SLO, and SLA.', a: 'SLI = what you measure (e.g., 99.95% of requests returned 200 in <300ms). SLO = your internal target (must maintain 99.9% success rate this quarter). SLA = contractual guarantee to customers (guarantee 99.5% uptime, with financial credits if breached). The SLO must be stricter than the SLA to give you a buffer to detect and fix issues before violating customer commitments.' },
      { q: 'What is an error budget and how do you use it?', a: 'Error budget = allowed failure quota derived from SLO. For 99.9% SLO: budget = 0.1% = 43.8 minutes/month. When budget is healthy: deploy features faster, take risks, experiment. When budget is low/exhausted: freeze non-critical deployments, prioritize reliability work, fix tech debt. This framework aligns development and operations incentives \u2014 both care about reliability.' },
      { q: 'Blue-green vs canary deployment?', a: 'Blue-green: two complete environments. Switch traffic instantly via load balancer. Instant rollback (switch back). Downside: doubles infrastructure cost. Canary: gradual traffic shift (5% \u2192 25% \u2192 100%) with automated metrics comparison. Minimal blast radius. Needs traffic splitting (Ingress, Istio, or Flagger). Slower but safer. Choose canary for high-traffic critical services; blue-green for simpler setups or when instant rollback is critical.' },
      { q: 'What does a blameless post-mortem look like?', a: 'Structured document containing: (1) Executive summary. (2) Timeline of events (detection \u2192 response \u2192 mitigation \u2192 resolution). (3) Root cause analysis (5 Whys technique). (4) Contributing factors. (5) Impact assessment (users affected, revenue lost, SLO impact). (6) What went well. (7) Action items with owners and deadlines. Focus: what system or process failed, never who made a mistake.' },
      { q: 'What is toil and how do you reduce it?', a: 'Toil = manual, repetitive, automatable work that scales linearly with service growth. Examples: restarting pods, provisioning capacity, rotating certificates, manual deployments. Reduce by: automating with scripts/pipelines, implementing self-healing (HPA, liveness probes), adopting GitOps, building internal platforms. Google SRE target: spend <50% of time on toil, >50% on engineering.' },
      { q: 'Explain the four golden signals of monitoring.', a: 'From the Google SRE book: (1) Latency \u2014 time to serve requests (distinguish success from error latency). (2) Traffic \u2014 demand on the system (HTTP requests/sec, transactions/sec). (3) Errors \u2014 rate of failed requests (HTTP 5xx, timeouts, business logic errors). (4) Saturation \u2014 how "full" the system is (CPU, memory, queue depth, disk). These four metrics cover most monitoring needs.' },
      { q: 'What is chaos engineering?', a: 'The discipline of experimenting on a system to build confidence in its resilience. Process: (1) Define steady state (normal metrics). (2) Hypothesize: "If X fails, the system should gracefully degrade." (3) Inject failure (kill pods, introduce latency, simulate AZ outage). (4) Observe. (5) Fix weaknesses found. Tools: Chaos Monkey (Netflix), Litmus (Kubernetes), AWS FIS. Run in production with proper safeguards for realistic results.' },
      { q: 'How do you reduce MTTR?', a: 'Reduce Mean Time To Recover through: (1) Better alerting \u2014 alert on symptoms (error rate), not causes (CPU). (2) Runbooks \u2014 documented steps for common incidents. (3) Observability \u2014 correlated metrics/logs/traces for fast diagnosis. (4) Automated remediation \u2014 self-healing scripts. (5) Practice \u2014 regular incident drills. (6) Feature flags \u2014 instant rollback without deployment. (7) Post-mortems \u2014 learn from every incident.' },
      { q: 'What is the difference between observability and monitoring?', a: 'Monitoring: predefined dashboards and alerts for known failure modes ("Is the system healthy?"). Observability: the ability to understand system behavior from its outputs, including novel/unknown failure modes ("Why is the system unhealthy?"). Observability requires rich instrumentation (high-cardinality metrics, structured logs, distributed traces) that lets you ask arbitrary questions without deploying new code.' },
    ],
    tip: 'The SLO/error budget framework separates SRE from traditional Ops. Frame reliability decisions in error budget terms: "We had 20% of our error budget remaining, so we proceeded with the deployment." This signals SRE thinking to interviewers.',
  },
];

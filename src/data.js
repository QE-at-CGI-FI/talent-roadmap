export const initialStops = [
  {
    id: 'stop-1',
    title: 'Git-First Mindset',
    summary: 'Version control as the backbone of all work',
    color: '#6366f1',
    sightseeings: [
      {
        id: 'ss-1-1',
        title: 'Commits & PRs',
        summary: 'Atomic commits, meaningful messages, pull request etiquette',
        details: `A git-first mindset starts with understanding commits as snapshots of intent, not just saves.\n\n• Write commits that tell a story — each one should answer "why"\n• Open pull requests as a communication tool, not just a merge mechanism\n• Review PRs as collaborative quality gates, not gatekeeping\n• Use draft PRs to share work-in-progress and gather early feedback`,
      },
      {
        id: 'ss-1-2',
        title: 'Cloning & Forking',
        summary: 'Working with repositories locally and contributing upstream',
        details: `Understanding the difference between cloning and forking unlocks how open-source and inner-source collaboration works.\n\n• Clone: get a full local copy of a repo you have direct access to\n• Fork: create your own copy of someone else's repo to propose changes\n• Set upstream remotes to stay in sync with the origin\n• Know when to branch vs. when to fork`,
      },
      {
        id: 'ss-1-3',
        title: 'Merge Strategies',
        summary: 'Merge commits, squash, rebase — choosing the right strategy',
        details: `How you integrate changes shapes the history and the team's ability to understand evolution.\n\n• Merge commit: preserves full branch history, clear but can be noisy\n• Squash merge: collapses a branch into one clean commit on main\n• Rebase: rewrites commits on top of main — linear history, requires discipline\n• Understand fast-forward vs. three-way merges\n• Team conventions matter more than the "best" strategy`,
      },
    ],
  },
]

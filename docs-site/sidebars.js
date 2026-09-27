// @ts-check

/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docsSidebar: [
    'index',
    {
      type: 'category',
      label: 'Core',
      collapsible: false,
      items: [
        'installation',
        'getting-started',
        'test-analysis',
        'dashboards',
        'quarantine',
        'ai-analysis',
        'administration',
        'troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Plugins',
      collapsible: false,
      items: [
        'auto-triage',
        'notifications',
      ],
    },
  ],
};

export default sidebars;

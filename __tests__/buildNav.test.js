const { buildNav } = require('../src/generator');

test('generates navigation tree', () => {
  const pages = [
    { file: 'guide/install.md', data: { title: 'Install', order: 1 } },
    { file: 'guide/usage.md', data: { title: 'Usage', order: 2 } },
    { file: 'guide/nested/info.md', data: { title: 'Info', order: 1 } }
  ];
  const tree = buildNav(pages);
  const guide = tree.find(n => n.name === 'guide');
  expect(guide).toBeDefined();
  expect(guide.children.length).toBe(3);
  const install = guide.children.find(c => c.name === 'install.md');
  expect(install.path).toBe('/guide/install.html');
});

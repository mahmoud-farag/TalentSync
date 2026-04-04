/*
Input: ['--name', 'test', '--age', '25']
Output: { name: 'test', age: '25' }
*/
function parseArgs(argv) {
  const args = {};

  argv.forEach((item, index) => {
    const isEven = index % 2 === 0;

    if (isEven) {
      const normalizedItem = item.replace('--', '');
      args[normalizedItem] = argv[index + 1];
    }
  });

  return args;
}

console.log(parseArgs(['--name', 'test', '--age', '25']));

export default (nodes, topParentId) => {
  const datas = [...nodes];
  if (datas && datas.length > 0 && datas[0].sort) {
    datas.sort((prev, next) => {
      if (prev.sort && next.sort) {
        if (prev.sort < next.sort) return -1;
        if (prev.sort > next.sort) return 1;
      }
      return 0;
    });
  }

  const map = {};
  const roots = [];
  for (let i = 0; i < datas.length; i += 1) {
    datas[i].children = [];
    map[datas[i].id] = i;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const node = datas[i];
    if (node.parent !== topParentId) {
      if (datas[map[node.parent]]) datas[map[node.parent]].children.push(node);
    } else {
      roots.push(datas[i]);
    }
  }

  // const getLevel = (data, level) => {
  //   for (let i = 0; i < data.length; i += 1) {
  //     data[i].level = level;
  //     if (data[i].children && data[i].children.length > 0) {
  //       getLevel(data[i].children, level + 1);
  //     }
  //   }
  // };

  // getLevel(roots, 1);
  return roots;
};

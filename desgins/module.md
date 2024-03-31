## 模型设计

```js
const state = {
  stage: {
    version: 0,
    children: [
      {
        id: '',
        children: [
          {
            id: '',
            children: [],
          },
        ],
      },
    ],
    layer: {
      [id]: {
        type: '',
        attrs: {},
      },
    },
    shape: {
      [id]: {
        type: '',
        attrs: {},
      },
    },
  },
};
```

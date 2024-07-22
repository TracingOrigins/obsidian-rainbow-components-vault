---
defines-react-components: true
---

# 网易云音乐组件

```jsx:component:Musicbar
const musicid = props.src.trim(" ");
const musicsrc='https://music.163.com/outchain/player?type=0&id='+musicid+'&auto=0&height=240';
return (
	<>
		<iframe
      title="iframe"
      src={musicsrc}
      style={{ width: '100%', border: 0, height: 240 }}
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      scrolling="no"
    ></iframe>
	</>
)
```

## 调用方式

```jsx::Musicbar
6894168416
```
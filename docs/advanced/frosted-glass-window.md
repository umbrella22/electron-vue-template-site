# windows 中的毛玻璃窗口效果

在看到 macos 中的毛玻璃效果，我承认我酸了，但是 win10 中的设置却是半边毛玻璃效果的，这让我看到了一丝希望，毕竟是系统已经自带了这个 api，至于怎么调用，那就是我们自己的事情了。终于，在群友`℡〆啸、**、龍騰、◇雪晨`大佬的帮助下，成功让 electron 能够拥有此项功能

- 首先，准备我们这次需要的工具包：
  - ffi-napi
  - ref-napi
  - ref-struct-napi
  - windows 8 以上版本的操作系统

```bash
yarn add ffi-napi ref-napi ref-struct-napi -S
# 或者
npm install ffi-napi ref-napi ref-struct-napi -S
```

:::tip 提示
安装完成以后，模板将会自动执行 rebuild，剩下就是写代码了。当然你可能会遇到 rebuild 失败的情况，当发生 rebuild 失败时，你需要按照调用原生 dll 篇章来对你的环境进行检查。而且如果您没有使用 webpack 对主进程进行打包时（比如 rollup）您需要将这三个依赖添加到[设置外部引用(externals)](https://rollupjs.org/guide/zh/#rolluprollup)才可以正常工作
:::

```js
// 新建一个名为maobili的js，内容为
/**
 * power by 猫猫头(864736317)
 */
// 都需要安装一次
import ffi from "ffi-napi";
import ref from "ref-napi";
import struct from "ref-struct-napi";

const INT = ref.types.int;

const AccentPolicy = struct({
  AccentState: INT,
  AccentFlags: INT,
  GradientColor: INT,
  AnimationId: INT,
});
const WindowCompositionAttributeData = struct({
  Attribute: INT,
  Data: ref.refType(AccentPolicy),
  SizeOfData: INT,
});

const accent = new AccentPolicy();
// 颜色类型0-6
/**
 * ACCENT_DISABLED=0，禁用
 * ACCENT_ENABLE_GRADIENT=1，不透明，可以设置颜色
 * ACCENT_ENABLE_TRANSPARENT_GRADIENT=2，只透明，可以设置颜色
 * ACCENT_ENABLE_BLUR_BEHIND=3，毛玻璃，无法设置颜色
 * ACCENT_ENABLE_ACRYLIC_BLUR_BEHIND=4，毛玻璃可以设置颜色但是窗口不可移动并无法拖动大小
 * ACCENT_ENABLE_HOST_BACKDROP=5， // 必须win10 1809以上才可以使用
 * ACCENT_INVALID_STATE= 6 非法6及其以上
 */
// 但是这里其实通常是可以设置成3，然后通过css带上rgba通道来实现着色效果，
// 唯一的区别就是，它的模糊程度不如4
accent.AccentState = 4;
// 颜色值
// 255<<0|1<<8|2<<16|100<<24
// 其中255 1 2 100为rgba值，0 8 16 24是固定
accent.GradientColor = (34 << 0) | (34 << 8) | (34 << 16) | (0 << 24);

const windowcompositon = new WindowCompositionAttributeData();
windowcompositon.Attribute = 19;
windowcompositon.Data = accent.ref();
windowcompositon.SizeOfData = accent.ref().byteLength;

// 传入参数，窗口句柄id和颜色设置参数
const user32 = new ffi.Library("user32", {
  SetWindowCompositionAttribute: [
    INT,
    [INT, ref.refType(WindowCompositionAttributeData)],
  ],
});
// 导出
export { windowcompositon, user32 };
```

```js
// 在创建窗口的位置引入
import { user32, windowcompositon } from "你自己存放上面js的位置/maoboli";
// 同时记得开启窗体透明和无边框
// 需要注意的是 tempWindow 为您需要对其进行毛玻璃化的窗口实例
const handle = tempWindow.getNativeWindowHandle();
user32.SetWindowCompositionAttribute(
  handle.readInt32LE(),
  windowcompositon.ref()
);
```

> 如果一切顺利的话您将得到如下图的效果

<div style="display: flex;justify-content: center;">
<img style="width: 290px;" src="/electron-vue-template-doc/images/img/maoboli.png">
</div>

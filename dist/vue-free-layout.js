import { ref as te, reactive as ne, computed as R, onMounted as ee, onUnmounted as oe, watch as K, defineComponent as re, openBlock as M, createElementBlock as C, normalizeStyle as G, Fragment as ie, renderList as le, withDirectives as se, withModifiers as ce, unref as Q, normalizeClass as ue, withMemo as ae, renderSlot as de, vShow as fe } from "vue";
function me(i, I = {}) {
  const {
    animationDuration: h = 300,
    animationEasing: f = "cubic-bezier(0.4, 0, 0.2, 1)",
    roundPixel: s = !1,
    multiSelect: $ = !1
  } = I, g = te(null), v = ne({ width: 0, height: 0 });
  let m = null;
  function a(e, n) {
    if (e == null) return 0;
    let o;
    if (typeof e == "number")
      o = e;
    else if (e.endsWith("%"))
      o = parseFloat(e) / 100 * n;
    else {
      const t = parseFloat(e);
      o = isNaN(t) ? 0 : t;
    }
    return s ? Math.round(o) : o;
  }
  function _(e) {
    return e == null ? "0px" : typeof e == "number" ? `${e}px` : e;
  }
  const B = R(() => {
    const e = i.value || [], { width: n, height: o } = v;
    return e.map((t) => {
      const r = n > 0 ? a(t.x, n) : 0, l = o > 0 ? a(t.y, o) : 0, u = n > 0 ? a(t.w, n) : 0, d = o > 0 ? a(t.h, o) : 0;
      return {
        position: "absolute",
        left: "0px",
        top: "0px",
        width: `${u}px`,
        height: `${d}px`,
        transform: `translate(${r}px, ${l}px)`,
        zIndex: t.zIndex ?? 1,
        transition: `transform ${h}ms ${f}, width ${h}ms ease, height ${h}ms ease`
      };
    });
  });
  function x() {
    if (!g.value) return;
    const e = g.value.getBoundingClientRect();
    v.width = e.width, v.height = e.height;
  }
  function F() {
    g.value && (m = new ResizeObserver(() => {
      x();
    }), m.observe(g.value));
  }
  function D() {
    m && (m.disconnect(), m = null);
  }
  ee(() => {
    x(), F();
  }), oe(() => {
    D();
  }), K(
    v,
    (e) => {
    }
  );
  function E(e, n) {
    const o = new Map(n.map((t) => [t.id, t]));
    return e.filter((t) => {
      const r = o.get(t.id);
      return r ? t.x !== r.x || t.y !== r.y || t.w !== r.w || t.h !== r.h || t.zIndex !== r.zIndex : !0;
    });
  }
  function O() {
    x();
  }
  function w(e) {
    const { width: n, height: o } = v;
    return {
      x: n > 0 ? a(e.x, n) : 0,
      y: o > 0 ? a(e.y, o) : 0,
      w: n > 0 ? a(e.w, n) : 0,
      h: o > 0 ? a(e.h, o) : 0
    };
  }
  function L() {
    return (i.value || []).map((n) => {
      const o = w(n);
      return {
        ...n,
        pixelX: o.x,
        pixelY: o.y,
        pixelW: o.w,
        pixelH: o.h
      };
    });
  }
  function p(e) {
    return (i.value || []).find((n) => n.id === e);
  }
  function y(e) {
    return (i.value || []).findIndex((n) => n.id === e);
  }
  function P(e) {
    const n = p(e);
    return n ? w(n) : null;
  }
  function c(e, n) {
    const o = i.value || [], t = y(e);
    return t === -1 ? !1 : (o[t] = { ...o[t], ...n }, !0);
  }
  function N(e) {
    const n = i.value || [];
    return n.push(e), n.length - 1;
  }
  function A(e) {
    const n = i.value || [], o = y(e);
    return o === -1 ? !1 : (n.splice(o, 1), !0);
  }
  function T() {
    i.value && (i.value = []);
  }
  function b(e) {
    if ($)
      return c(e, { selected: !0 });
    const n = i.value || [];
    let o = !1;
    return n.forEach((t) => {
      t.id === e ? (t.selected = !0, o = !0) : t.selected = !1;
    }), o;
  }
  function S(e) {
    return c(e, { selected: !1 });
  }
  function V(e) {
    const n = p(e);
    return n ? n.selected ? S(e) : b(e) : !1;
  }
  function Z() {
    (i.value || []).forEach((n) => {
      n.selected = !1;
    });
  }
  function J() {
    return (i.value || []).filter((e) => e.selected);
  }
  function W(e) {
    return c(e, { visible: !0 });
  }
  function H(e) {
    return c(e, { visible: !1 });
  }
  function U(e) {
    const n = p(e);
    return n ? c(e, { visible: n.visible === !1 }) : !1;
  }
  function X() {
    return (i.value || []).filter((e) => e.visible !== !1);
  }
  function z(e, n) {
    return c(e, { zIndex: n });
  }
  function k(e) {
    const n = i.value || [], o = Math.max(...n.map((t) => t.zIndex ?? 1));
    return c(e, { zIndex: o + 1 });
  }
  function Y(e) {
    const n = i.value || [], o = Math.min(...n.map((t) => t.zIndex ?? 1));
    return c(e, { zIndex: o - 1 });
  }
  function j(e) {
    const n = p(e);
    return n ? c(e, { zIndex: (n.zIndex ?? 1) + 1 }) : !1;
  }
  function q(e) {
    const n = p(e);
    return n ? c(e, { zIndex: Math.max(1, (n.zIndex ?? 1) - 1) }) : !1;
  }
  return {
    containerRef: g,
    containerSize: v,
    itemStyles: B,
    toPixel: a,
    normalizeSize: _,
    findChangedItems: E,
    refreshLayout: O,
    resolveItem: w,
    resolveAllItems: L,
    getItemById: p,
    getItemIndex: y,
    getItemPixelRect: P,
    updateItem: c,
    addItem: N,
    removeItem: A,
    clearAll: T,
    selectItem: b,
    deselectItem: S,
    toggleSelect: V,
    clearSelection: Z,
    getSelectedItems: J,
    showItem: W,
    hideItem: H,
    toggleVisibility: U,
    getVisibleItems: X,
    setZIndex: z,
    bringToFront: k,
    sendToBack: Y,
    moveForward: j,
    moveBackward: q
  };
}
const he = ["onClick", "onDblclick", "onContextmenu", "onMouseenter", "onMouseleave"], ve = /* @__PURE__ */ re({
  __name: "FreeLayout",
  props: {
    items: {},
    animationDuration: { default: 300 },
    animationEasing: { default: "cubic-bezier(0.4, 0, 0.2, 1)" },
    roundPixel: { type: Boolean, default: !1 },
    overflow: { default: "hidden" },
    multiSelect: { type: Boolean, default: !1 }
  },
  emits: ["item-click", "item-double-click", "item-contextmenu", "item-mouseenter", "item-mouseleave", "items-change", "selection-change", "container-resize", "ready"],
  setup(i, { expose: I, emit: h }) {
    const f = i, s = h, $ = R(() => f.items), g = {
      animationDuration: f.animationDuration,
      animationEasing: f.animationEasing,
      roundPixel: f.roundPixel,
      multiSelect: f.multiSelect
    }, {
      containerRef: v,
      containerSize: m,
      itemStyles: a,
      findChangedItems: _,
      refreshLayout: B,
      resolveItem: x,
      resolveAllItems: F,
      getItemById: D,
      getItemIndex: E,
      getItemPixelRect: O,
      updateItem: w,
      addItem: L,
      removeItem: p,
      clearAll: y,
      selectItem: P,
      deselectItem: c,
      toggleSelect: N,
      clearSelection: A,
      getSelectedItems: T,
      showItem: b,
      hideItem: S,
      toggleVisibility: V,
      getVisibleItems: Z,
      setZIndex: J,
      bringToFront: W,
      sendToBack: H,
      moveForward: U,
      moveBackward: X
    } = me($, g);
    let z = "", k = [];
    function Y() {
      return f.items.filter((t) => t.selected).map((t) => t.id);
    }
    K(
      () => f.items,
      (t, r) => {
        const l = JSON.stringify(t);
        if (l === z) return;
        if (r && r.length > 0) {
          const d = _(t, r);
          d.length > 0 && s("items-change", d);
        }
        const u = Y();
        JSON.stringify(u) !== JSON.stringify(k) && (k = u, s("selection-change", t.filter((d) => d.selected))), z = l;
      },
      { deep: !0 }
    ), K(
      m,
      (t) => {
        t.width > 0 && t.height > 0 && s("container-resize", { width: t.width, height: t.height });
      }
    ), ee(() => {
      s("ready");
    });
    function j(t, r) {
      t.locked || s("item-click", t, r);
    }
    function q(t, r) {
      t.locked || s("item-double-click", t, r);
    }
    function e(t, r, l) {
      t.locked || s("item-contextmenu", t, r, l);
    }
    function n(t, r) {
      s("item-mouseenter", t, r);
    }
    function o(t, r) {
      s("item-mouseleave", t, r);
    }
    return I({
      containerSize: m,
      getContainerSize: () => ({ width: m.width, height: m.height }),
      refreshLayout: B,
      resolveItem: x,
      resolveAllItems: F,
      getItemById: D,
      getItemIndex: E,
      getItemPixelRect: O,
      updateItem: w,
      addItem: L,
      removeItem: p,
      clearAll: y,
      selectItem: P,
      deselectItem: c,
      toggleSelect: N,
      clearSelection: A,
      getSelectedItems: T,
      showItem: b,
      hideItem: S,
      toggleVisibility: V,
      getVisibleItems: Z,
      setZIndex: J,
      bringToFront: W,
      sendToBack: H,
      moveForward: U,
      moveBackward: X
    }), (t, r) => (M(), C("div", {
      ref_key: "containerRef",
      ref: v,
      class: "free-layout",
      style: G({ overflow: i.overflow })
    }, [
      (M(!0), C(ie, null, le(i.items, (l, u) => se((M(), C("div", {
        key: l.id,
        class: ue(["free-layout__item", {
          "is-selected": l.selected,
          "is-locked": l.locked
        }]),
        style: G(Q(a)[u]),
        onClick: (d) => j(l, u),
        onDblclick: (d) => q(l, u),
        onContextmenu: ce((d) => e(l, u, d), ["prevent"]),
        onMouseenter: (d) => n(l, u),
        onMouseleave: (d) => o(l, u)
      }, [
        ae([l.id, l.payload], () => (M(), C("div", { class: "free-layout__content" }, [
          de(t.$slots, "default", {
            item: l,
            index: u,
            style: G(Q(a)[u])
          }, void 0, !0)
        ])), r, 0)
      ], 46, he)), [
        [fe, l.visible !== !1]
      ])), 128))
    ], 4));
  }
}), pe = (i, I) => {
  const h = i.__vccOpts || i;
  for (const [f, s] of I)
    h[f] = s;
  return h;
}, Ie = /* @__PURE__ */ pe(ve, [["__scopeId", "data-v-10ce7b74"]]);
export {
  Ie as FreeLayout,
  me as useFreeLayout
};

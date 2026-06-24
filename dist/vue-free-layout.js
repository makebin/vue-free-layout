import { ref as I, reactive as R, computed as b, onMounted as E, onUnmounted as F, watch as _, defineComponent as O, openBlock as g, createElementBlock as w, normalizeStyle as S, Fragment as L, renderList as P, unref as $, withMemo as B, renderSlot as D } from "vue";
function N(u, d = {}) {
  const {
    animationDuration: c = 300,
    animationEasing: s = "cubic-bezier(0.4, 0, 0.2, 1)",
    roundPixel: a = !1
  } = d, l = I(null), f = R({ width: 0, height: 0 });
  let h = null;
  function r(e, o) {
    if (e == null) return 0;
    let n;
    if (typeof e == "number")
      n = e;
    else if (e.endsWith("%"))
      n = parseFloat(e) / 100 * o;
    else {
      const t = parseFloat(e);
      n = isNaN(t) ? 0 : t;
    }
    return a ? Math.round(n) : n;
  }
  function m(e) {
    return e == null ? "0px" : typeof e == "number" ? `${e}px` : e;
  }
  const y = b(() => {
    const e = u.value || [], { width: o, height: n } = f;
    return e.map((t) => {
      const i = o > 0 ? r(t.x, o) : 0, M = n > 0 ? r(t.y, n) : 0, k = o > 0 ? r(t.w, o) : 0, C = n > 0 ? r(t.h, n) : 0;
      return {
        position: "absolute",
        left: "0px",
        top: "0px",
        width: `${k}px`,
        height: `${C}px`,
        transform: `translate(${i}px, ${M}px)`,
        zIndex: t.zIndex ?? 1,
        transition: `transform ${c}ms ${s}, width ${c}ms ease, height ${c}ms ease`
      };
    });
  });
  function p() {
    if (!l.value) return;
    const e = l.value.getBoundingClientRect();
    f.width = e.width, f.height = e.height;
  }
  function v() {
    l.value && (h = new ResizeObserver(() => {
      p();
    }), h.observe(l.value));
  }
  function x() {
    h && (h.disconnect(), h = null);
  }
  E(() => {
    p(), v();
  }), F(() => {
    x();
  }), _(
    f,
    (e) => {
    }
  );
  function z(e, o) {
    const n = new Map(o.map((t) => [t.id, t]));
    return e.filter((t) => {
      const i = n.get(t.id);
      return i ? t.x !== i.x || t.y !== i.y || t.w !== i.w || t.h !== i.h || t.zIndex !== i.zIndex : !0;
    });
  }
  return {
    containerRef: l,
    containerSize: f,
    itemStyles: y,
    toPixel: r,
    normalizeSize: m,
    findChangedItems: z
  };
}
const J = ["onClick", "onMouseenter", "onMouseleave"], U = /* @__PURE__ */ O({
  __name: "FreeLayout",
  props: {
    items: {},
    animationDuration: { default: 300 },
    animationEasing: { default: "cubic-bezier(0.4, 0, 0.2, 1)" },
    roundPixel: { type: Boolean, default: !1 },
    overflow: { default: "hidden" }
  },
  emits: ["item-click", "item-mouseenter", "item-mouseleave", "items-change", "container-resize"],
  setup(u, { expose: d, emit: c }) {
    const s = u, a = c, l = b(() => s.items), f = {
      animationDuration: s.animationDuration,
      animationEasing: s.animationEasing,
      roundPixel: s.roundPixel
    }, { containerRef: h, containerSize: r, itemStyles: m, findChangedItems: y } = N(l, f);
    let p = "";
    _(
      () => s.items,
      (e, o) => {
        const n = JSON.stringify(e);
        if (n !== p) {
          if (o && o.length > 0) {
            const t = y(e, o);
            t.length > 0 && a("items-change", t);
          }
          p = n;
        }
      },
      { deep: !0 }
    ), _(
      r,
      (e) => {
        e.width > 0 && e.height > 0 && a("container-resize", { width: e.width, height: e.height });
      }
    );
    function v(e, o) {
      a("item-click", e, o);
    }
    function x(e, o) {
      a("item-mouseenter", e, o);
    }
    function z(e, o) {
      a("item-mouseleave", e, o);
    }
    return d({
      containerSize: r,
      getContainerSize: () => ({ width: r.width, height: r.height })
    }), (e, o) => (g(), w("div", {
      ref_key: "containerRef",
      ref: h,
      class: "free-layout",
      style: S({ overflow: u.overflow })
    }, [
      (g(!0), w(L, null, P(u.items, (n, t) => (g(), w("div", {
        key: n.id,
        class: "free-layout__item",
        style: S($(m)[t]),
        onClick: (i) => v(n, t),
        onMouseenter: (i) => x(n, t),
        onMouseleave: (i) => z(n, t)
      }, [
        B([n.id, n.payload], () => (g(), w("div", { class: "free-layout__content" }, [
          D(e.$slots, "default", {
            item: n,
            index: t,
            style: S($(m)[t])
          }, void 0, !0)
        ])), o, 0)
      ], 44, J))), 128))
    ], 4));
  }
}), W = (u, d) => {
  const c = u.__vccOpts || u;
  for (const [s, a] of d)
    c[s] = a;
  return c;
}, q = /* @__PURE__ */ W(U, [["__scopeId", "data-v-53021742"]]);
export {
  q as FreeLayout,
  N as useFreeLayout
};

import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "./cartStore";

beforeEach(() => {
  useCartStore.getState().clear();
});

describe("cartStore", () => {
  it("tambah item dan hitung total", () => {
    const { add, totalQty } = useCartStore.getState();
    add("p01", 2);
    add("p02");
    expect(totalQty()).toBe(3);
  });

  it("tambah produk yang sama menumpuk jumlah", () => {
    const store = useCartStore.getState();
    store.add("p01", 2);
    useCartStore.getState().add("p01", 3);
    expect(useCartStore.getState().items).toEqual([
      { productId: "p01", quantity: 5 },
    ]);
  });

  it("jumlah dibatasi 1 sampai 99", () => {
    const store = useCartStore.getState();
    store.add("p01", 200);
    expect(useCartStore.getState().items[0].quantity).toBe(99);
    useCartStore.getState().setQty("p01", 0);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("ubah jumlah, hapus, dan kosongkan", () => {
    const store = useCartStore.getState();
    store.add("p01", 2);
    store.add("p02", 1);
    useCartStore.getState().setQty("p01", 4);
    expect(useCartStore.getState().items[0].quantity).toBe(4);
    useCartStore.getState().remove("p02");
    expect(useCartStore.getState().items).toHaveLength(1);
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toEqual([]);
  });
});

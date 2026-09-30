import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { ImageInput } from "./ImageInput";

function selectFile(input, file) {
  fireEvent.change(input, { target: { files: [file] } });
}

describe("ImageInput", () => {
  it("meneruskan file terpilih ke penampung tambah (pratinjau)", () => {
    const onSelectPendingFiles = vi.fn();
    const { container } = render(<ImageInput value={[]} onChange={() => {}} onSelectPendingFiles={onSelectPendingFiles} />);
    const picker = container.querySelector('input[type="file"]');
    const file = new File(["isi"], "foto.png", { type: "image/png" });
    selectFile(picker, file);
    expect(onSelectPendingFiles).toHaveBeenCalledTimes(1);
    expect(onSelectPendingFiles.mock.calls[0][0].name).toBe("foto.png");
  });

  it("menolak SVG dengan pesan jelas", () => {
    const onSelectPendingFiles = vi.fn();
    const { container } = render(<ImageInput value={[]} onChange={() => {}} onSelectPendingFiles={onSelectPendingFiles} />);
    const picker = container.querySelector('input[type="file"]');
    selectFile(picker, new File(["x"], "jahat.svg", { type: "image/svg+xml" }));
    expect(onSelectPendingFiles).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]')).toHaveTextContent(/ditolak/);
  });

  it("mengunggah langsung dan menambahkan URL ke daftar", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <ImageInput value={[]} onChange={onChange} onUploadFile={async () => "/storage/foto.jpg"} />,
    );
    const picker = container.querySelector('input[type="file"]');
    selectFile(picker, new File(["isi"], "foto.jpg", { type: "image/jpeg" }));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(["/storage/foto.jpg"]);
    });
  });
});

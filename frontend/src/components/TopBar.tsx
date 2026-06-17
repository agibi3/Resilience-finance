import {useRef,useState} from "react";

import {Upload, Calendar,ChevronDown,Menu,Loader2,CheckCircle2} from "lucide-react";

export default function TopBar({
  onMenuToggle,
  onFileUpload
}) {

  const fileInputRef =
    useRef(null);

  const [uploadState,
    setUploadState] =
    useState("idle");

  async function handleFileChange(
    e
  ) {

    const file =
      e.target.files[0];

    if (!file) return;

    try {

      setUploadState(
        "uploading"
      );

      await onFileUpload(
        file
      );

      setUploadState(
        "success"
      );

      setTimeout(() => {
        setUploadState(
          "idle"
        );
      }, 3000);

    } catch (error) {

      console.error(
        error
      );

      setUploadState(
        "idle"
      );

    } finally {

      e.target.value =
        null;

    }

  }

  return (
    <header
      className="
      h-16
      bg-white
      border-b
      flex
      items-center
      justify-between
      px-4
      md:px-8
    "
    >

      <div
        className="
        flex
        items-center
        gap-3
      "
      >

        <button
          onClick={
            onMenuToggle
          }
          className="
          lg:hidden
          p-2
        "
        >
          <Menu
            className="
            w-5
            h-5
          "
          />
        </button>

        <div>

          <h2
            className="
            font-bold
            text-lg
          "
          >
            Welcome Back 👋
          </h2>

          <p
            className="
            text-xs
            text-slate-500
          "
          >
            SME Financial Dashboard
          </p>

        </div>

      </div>

      <div
        className="
        flex
        items-center
        gap-4
      "
      >

        <input
          type="file"
          ref={
            fileInputRef
          }
          accept="
          .csv,
          .xlsx,
          .xls
          "
          onChange={
            handleFileChange
          }
          className="hidden"
        />

        <button
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={
            uploadState ===
            "uploading"
          }
          className="
          flex
          items-center
          gap-2
          border
          px-3
          py-2
          rounded-lg
        "
        >

          {uploadState ===
            "idle" && (
            <Upload
              className="
              w-4
              h-4
              "
            />
          )}

          {uploadState ===
            "uploading" && (
            <Loader2
              className="
              w-4
              h-4
              animate-spin
              "
            />
          )}

          {uploadState ===
            "success" && (
            <CheckCircle2
              className="
              w-4
              h-4
              text-green-600
              "
            />
          )}

          <span>

            {uploadState ===
              "idle" &&
              "Upload Financials"}

            {uploadState ===
              "uploading" &&
              "Uploading..."}

            {uploadState ===
              "success" &&
              "Success"}

          </span>

        </button>

        <div
          className="
          hidden
          md:flex
          items-center
          gap-2
          border
          px-3
          py-2
          rounded-lg
        "
        >

          <Calendar
            className="
            w-4
            h-4
            "
          />

          {new Date()
            .toLocaleDateString()}

        </div>

        <div
          className="
          flex
          items-center
          gap-2
        "
        >

          <div
            className="
            w-8
            h-8
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
          "
          >
            A
          </div>

          <ChevronDown
            className="
            w-4
            h-4
            "
          />

        </div>

      </div>

    </header>
  );

}
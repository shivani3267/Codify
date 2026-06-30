

function ConfirmModal({
  id,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>

        <p className="py-4">{message}</p>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">{cancelText}</button>
          </form>

          <button
            className= "btn btn-error"
            onClick={() => {
              onConfirm();
              document.getElementById(id).close();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmModal;
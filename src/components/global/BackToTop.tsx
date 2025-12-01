export const BackToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="text-center my-4">
      <button
        onClick={scrollToTop}
        className="btn btn-outline-secondary"
        aria-label="Scroll back to top of page"
      >
        <i className="bi bi-arrow-up-circle me-2" aria-hidden="true"></i>
        Back to Top
      </button>
    </div>
  );
};

export default BackToTop;

import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";

import { DWWSBook } from "../content/books/dwws";
import { CZGBook } from "../content/books/czg";
import { AFEBook } from "../content/books/afe";

export const BooksPage = () => {
  return (
    <>
      <PageTitleH1
        title="Books"
        description="Some of the books I've read, recommend and found valuable."
        keywords="books, reading, recommendations, literature, valuable reads"
      />
      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <DWWSBook />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <CZGBook />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <AFEBook />
        </div>
        {/* <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          book4
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          book5
        </div> */}
      </div>
      <BackToTop />
    </>
  );
};

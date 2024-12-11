import React from 'react';
import { Link } from 'react-router-dom';

function NoRecipe() {

  return (
    <>
      <center>
      <section className="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="text-center">
                                <h3 className="h2 mb-2">You Did't post any Recipe Yet!</h3>
                                {/* <h4>Please login first.. </h4> */}
                                <Link to={`/recipe`}
                                    className="btn bsb-btn-5xl btn-dark rounded-pill px-5 fs-6 m-0" role="button"
                                >
                                    Post Your Recipe
                                </Link>\
                            </div>
                        </div>
                    </div>
                </div>
            </section>
      </center>
    </>
  );
}

export default NoRecipe;
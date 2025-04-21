// client/src/components/ReviewForm.js
import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ReviewForm = ({ movieId, onReviewSubmit }) => {
  const { user } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    rating: 5,
    text: ''
  };

  const validationSchema = Yup.object({
    rating: Yup.number()
      .required('Rating is required')
      .min(1, 'Minimum rating is 1')
      .max(10, 'Maximum rating is 10'),
    text: Yup.string()
      .max(2000, 'Review must be less than 2000 characters')
  });

  const onSubmit = async (values, { resetForm }) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const review = {
        movieId,
        rating: values.rating,
        text: values.text
      };
      const response = await api.post('/reviews', review);
      onReviewSubmit(response.data);
      resetForm();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl ${star <= values.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => setFieldValue('rating', star)}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-gray-600">{values.rating}/10</span>
              </div>
              <ErrorMessage name="rating" component="div" className="text-red-500 text-sm" />
            </div>
            
            <div className="mb-4">
              <label htmlFor="text" className="block text-gray-700 mb-2">Review</label>
              <Field
                as="textarea"
                name="text"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your thoughts about this movie..."
              />
              <ErrorMessage name="text" component="div" className="text-red-500 text-sm" />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReviewForm;
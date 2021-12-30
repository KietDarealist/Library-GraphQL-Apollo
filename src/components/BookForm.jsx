import React, { useState } from "react";
import Col from "react-bootstrap/Col";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useQuery, useMutation } from "@apollo/client";
import { getAuthors, getBooks } from "../graphql-client/queries";
import { addSingleBook } from "../graphql-client/mutation";

const BookForm = () => {
  const [newBook, setNewBook] = useState({
    name: "",
    genre: "",
    authorId: "",
  });

  const { name, genre, authorId } = newBook;

  const onInputChange = (event) => {
    setNewBook({
      ...newBook,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    addBook({
      variables: {
        name: name,
        genre: genre,
        authorId: authorId,
      },
      refetchQueries: [{ query: getBooks }],
    });

    setNewBook({ name: "", genre: "", authorId: "" });
  };

  //GPL operations
  const { loading, error, data } = useQuery(getAuthors);

  const [addBook, dataMutation] = useMutation(addSingleBook);
  return (
    <Col>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Book name"
            name="name"
            onChange={onInputChange}
            value={name}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Book genre"
            name="genre"
            onChange={onInputChange}
            value={genre}
          />
        </Form.Group>
        <Form.Group>
          {loading ? (
            <p>Loading author....</p>
          ) : (
            <Form.Control
              as="select"
              name="authorId"
              onChange={onInputChange}
              value={authorId}
            >
              <option value="" disabled>
                Select author
              </option>
              {data.authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </Form.Control>
          )}
        </Form.Group>
        <Button className="float-right" variant="info" type="submit">
          Add book
        </Button>
      </Form>
    </Col>
  );
};

export default BookForm;

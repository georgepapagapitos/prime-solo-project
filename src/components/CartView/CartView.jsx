import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import moment from 'moment';
import { useHistory } from "react-router";
import Swal from 'sweetalert2';
import { Button, Divider, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button: {
    marginTop: 10
  }
})

function CartView() {

  const cart = useSelector((store) => store.cart);

  const classes = useStyles();

  const dispatch = useDispatch();
  const history = useHistory();

  const date = moment().format();

  useEffect(() => {
    dispatch({
      type: 'FETCH_ACTIVE_CART'
    })
  }, [])

  const handleRemove = (book) => {
    console.log('remove book from cart', book);
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: {bookId: book.id}
    });
    dispatch({
      type: 'INCREASE_QUANTITY',
      payload: {isbn: book.isbn}
    });
  }

  const handleCheckout = (cart) => {
    console.log('in handlecheckout', cart, date);
    Swal.fire({
      title: 'Are you ready to checkout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#f50057',
      confirmButtonText: 'Yes, checkout!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({
          type: 'CHECKOUT',
          payload: {
            cart: cart,
            date: date
          }
        })
        Swal.fire(
          'Order complete!',
          'Your books will on their way soon!.',
          'success'
        )
        history.push('/user');
      }
    })
  }

  return (
    <div className="container">
      <Typography gutterBottom variant="h3">Current Cart</Typography>
      <Divider />
    <div>
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((book, i) => {
              return (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {book.title}
                  </TableCell>
                  <TableCell align="left">
                    {book.author}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="secondary"  onClick={() => handleRemove(book)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </TableContainer>
    <Button className={classes.button} type="button" variant="outlined" color="primary" onClick={() => handleCheckout(cart)}>Checkout</Button>
      </div>
    </div>
  )
}

export default CartView
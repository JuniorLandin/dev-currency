import { Link, useNavigate } from 'react-router-dom'
import styles from './home.module.css'

import { BiSearch } from 'react-icons/bi'
import { FormEvent, useEffect, useState } from 'react'

interface CoinProps {
  name: string;
  price: string;
  delta_24h: string;
  symbol: string;
  volume_24h: string;
  market_cap: string;
  formatedPrice: string;
  formatedMarket: string;
  numberDelta?: number;
}

interface DataProps {
  coins: CoinProps[]
}

export function Home() {

  const [coins, setCoins] = useState<CoinProps[]>([])
  const[input, setInput] = useState("")
  const navigate = useNavigate();

  useEffect(() => {

    function getData(){
      fetch('https://sujeitoprogramador.com/api-cripto/?key=b4cd8f8fb3de94c6')
      .then(response => response.json())
      .then((data: DataProps) => {
        // eslint-disable-next-line prefer-const
        let coinsData = data.coins.slice(0, 15);

        const price = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL"
        })

        const formatResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.price)),
            formatedMarket: price.format(Number(item.market_cap)),
            numberDelta: parseFloat(item.delta_24h.replace(",", "."))
          }
          return formated;
        })
        
        setCoins(formatResult);
      })
    }

    getData();

  }, [])

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    
    if(input === "") return;

    navigate(`detail/${input}`)
  }

  return(
    <main className={styles.container}>
      <form
       className={styles.form}
       onSubmit={handleSearch}
      >
        <input
          placeholder='Digite o símbolo da Moeda: BTC...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type='submit'>
          <BiSearch size={30} color='#fff'/>
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope='col'>Moeda</th>
            <th scope='col'>Valor Mercado</th>
            <th scope='col'>Preço</th>
            <th scope='col'>Volume</th>
          </tr>
        </thead>

        <tbody id='tbody'>
          {coins.map(item => (
              <tr key={item.name} className={styles.tr}>
              <td className={styles.tdLabel} data-label="Moeda">
                <Link className={styles.link} to={`detail/${item.symbol}`}>
                  <span>{item.name}</span> | {item.symbol}
                </Link>
              </td>
              <td className={styles.tdLabel} data-label="Mercado">
                {item.formatedMarket}
              </td>
              <td className={styles.tdLabel} data-label="Preço">
                {item.formatedPrice}
              </td>
              <td className={item?.numberDelta && item.numberDelta <= 0 ? styles.tdLoss : styles.tdProfit} data-label="Volume">
                <span>{item.delta_24h}</span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </main>
  )
}
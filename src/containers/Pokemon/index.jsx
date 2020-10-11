import React from 'react' ;
import App from '../App';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { setPokemonId, setPokemonLoading, setPokemon, setPokemonError, initPokemonLoading } from '../../store/pokemon/actions';
import { AppService } from '../../services/app.service';
import LoadingStatus from '../../constants/loading-status.constants' ;
import DetailedCard from './components/DetailedCard';
import './styles.scss';

class PokemonPage extends React.PureComponent {

    async componentDidMount(){
        const { getPokemon, setIdError, match: { params: { id } } }= this.props
        if(!parseInt(id)) return setIdError()
        await getPokemon(id)
    }

    componentWillUnmount(){
        const { initPokemonLoading }= this.props
        initPokemonLoading()
    }

    render(){
        const {pokemon, loading, error }= this.props
        return (
            <App>
                <Helmet>View pokemon</Helmet>
                {
                    (loading === LoadingStatus.LOADING || loading === LoadingStatus.NO_ACTIVITY ) ? 'loading data...' : 
                        loading === LoadingStatus.LOADING_FAILED ? <p className="error--message" >{error.message}</p>  : 
                                    <div className="pokemon--props" >
                                        <div className="pokemon--props__main" >
                                            <section >
                                                <figure>
                                                    { pokemon.sprites && 
                                                        <img className="front--logo" 
                                                            src={pokemon.sprites.other['official-artwork'].front_default} alt="" /> }
                                                     { pokemon.sprites && <img className="back--logo" src={pokemon.sprites.back_default} alt=""/> }
                                                    <figcaption>
                                                        <div>{pokemon.name}</div>
                                                        <p className="specy--name" >specy, <span>{ pokemon.species && pokemon.species.name}</span></p>
                                                    </figcaption>
                                                </figure>
                                                <div className="pokemon--details" >
                                                        <p>Height, <br/><span>{pokemon.height}</span></p>
                                                        <p>Weight, <br/><span>{pokemon.weight}</span></p>
                                                        <p>Exp, <br/><span>{pokemon.base_experience}</span></p>
                                                        <p>Order, <br/><span>{pokemon.order}</span></p>
                                                </div>
                                            </section>
                                            <section className="pokemon--props__stats" >
                                                <div className="stats--title" >Stats</div>
                                                { pokemon.stats && 
                                                    <div className="stats--content" >
                                                        {pokemon.stats.map((statItem,index)=> (
                                                            <div key={index} className="stats--content__item" >
                                                                <p>{statItem.stat.name},</p>
                                                                <div className="stats--content__item--numbers">
                                                                    <p><span>{statItem.base_stat}</span></p>
                                                                    <p><span>{statItem.effort}</span></p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                }
                                            </section>
                                        </div>
                                        <div className="pokemon--props__details" >
                                            <DetailedCard {...pokemon}  />
                                        </div>
                                    </div>
                }
            </App>
        )
    }
}

export default connect(
    state => ({
        pokemon: state.pokemon.result,
        loading: state.pokemon.loadingStatus,
        error: state.pokemon.error
    }),
    dispatch => ({
        getPokemon(id){
            dispatch(setPokemonId(id))
            dispatch(setPokemonLoading())
            return AppService.getPokemonById(id)
              .then(response => {
                  dispatch(setPokemon(response))
              })
              .catch(err=> dispatch(setPokemonError(err)) )
              .finally(()=> Promise.resolve())

        },
        setIdError(){
            dispatch(setPokemonError({ message: `There's no pokemon item to display` }))
        },
        initPokemonLoading(){
            dispatch(initPokemonLoading())
        }
    })
)(PokemonPage)
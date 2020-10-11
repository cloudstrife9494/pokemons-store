import React from 'react';
import App from '../App';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { AppService } from '../../services/app.service';
import { setTypesError, setTypesLoading, setTypes } from '../../store/types/actions';
import LoadingStatus from '../../constants/loading-status.constants' ;
import TypeCard from './components/Card';
import './styles.scss';

class PokemonTypes extends React.PureComponent{
    async componentDidMount(){
        const { getTypes, types }= this.props
        await getTypes(types.length)
        console.log('resuss',this.props.types)
    }

    render(){
        const {types, isLoading } = this.props
        return (
            <App>
                <Helmet>Pokemon types</Helmet>
                <div className="types--listing" >
                    {
                        isLoading === LoadingStatus.LOADING ?  'loading...': types.map((type,index)=> <TypeCard key={index} {...type} />)
                    }
                </div>
            </App>
        )
    }
}

export default connect(
    state => ({
        types: state.types.result,
        isLoading: state.types.loadingStatus
    }),
    dispatch => ({
        getTypes(length){
            if(length) return Promise.resolve()
            dispatch(setTypesLoading())
            return AppService.getTypes()
                  .then(response=>{
                      console.log('then response=',response)
                        const TypesRequets= response.results
                                                            .filter(item=> !!item.url)
                                                            .map(type => AppService.getByUrl(type.url))
                        Promise.all(TypesRequets)
                          .then(responses=>{
                              console.log('types reponses',responses)
                              dispatch(setTypes(
                                  responses.filter(response => !!response)
                                        .map(response=> ({
                                            id: response.id,
                                            name: response.name,
                                            move_damage_class: response.move_damage_class && response.move_damage_class.name,
                                            damage_relations: response.damage_relations
                                        }))
                              ))
                          })
                          .catch(err=> dispatch(setTypesError(err)))
                  })
                  .catch(err=> dispatch(setTypesError(err)))
                  .finally(()=> Promise.resolve())
        }
    }) 
)(PokemonTypes)
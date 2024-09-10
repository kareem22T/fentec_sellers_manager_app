import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image, TextInput, ScrollView, ActivityIndicator, Modal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign, Ionicons, FontAwesome, } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';

const BackgroundImage = () => {
    return (
        <Image source={require('./../assets/imgs/setting_bg.png')} style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
        }} />
    )
}

export default function Profile({ navigation }) {
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentLang, setCurrentLag] = useState('ar')
    const [user, setUser] = useState(null)
    const [sellers, setSellers] = useState([])
    const [notificationToken, setNotificationToken] = useState('')
    const [token, setToken] = useState('')
    const [currentSellerId, setCurrentSellerId] = useState(null)
    const [currentSellerName, setCurrentSellerName] = useState(null)
    const [showReloadPopUp, setShowReloadPopUp] = useState(false)
    const [showDeletePopUp, setShowDeletePopUp] = useState(false)

    const handleShowReloadPopUp = (id, name) => {
        setCurrentSellerId(id)
        setCurrentSellerName(name)
        setShowReloadPopUp(true)
    }

    const handleShowDeletePopUp = (id, name) => {
        setCurrentSellerId(id)
        setCurrentSellerName(name)
        setShowDeletePopUp(true)
    }

    const getStoredToken = async () => {
        const admin_token = await SecureStore.getItemAsync('admin_token');
        console.log(admin_token);
        if (admin_token)
            return admin_token

        return '';
    }

    const getUser = async (token) => {
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/admin/get-admin`, {
                api_password: 'Fentec@scooters.algaria',
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setLoading(false);
                setErrors([]);
                setUser(response.data.data.admin);
                return response.data.data.admin;
            } else {
                setLoading(false);
                setErrors(response.data.errors);
                TimerMixin.setTimeout(() => {
                    setErrors([]);
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.error(error);
        }
    }

    const getSellers = async (token) => {
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/admin/get-sellers`, {
                api_password: 'Fentec@scooters.algaria',
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setLoading(false);
                setErrors([]);
                setSellers(response.data.data);
            } else {
                setLoading(false);
                setErrors(response.data.errors);
                TimerMixin.setTimeout(() => {
                    setErrors([]);
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.error(error);
        }
    }

    const handleReload = async (token) => {
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/admin/reload-seller-points`, {
                api_password: 'Fentec@scooters.algaria',
                seller_id: currentSellerId,
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setErrors([]);
                getSellers(token);
                setSuccessMsg(response.data.message);
                setShowReloadPopUp(false);
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    setSuccessMsg('')
                }, 2000);
            } else {
                setLoading(false);
                setErrors(response.data.errors);
                TimerMixin.setTimeout(() => {
                    setErrors([]);
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.error(error);
        }
    }

    const handleDelete = async (token) => {
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/admin/delete-seller`, {
                api_password: 'Fentec@scooters.algaria',
                seller_id: currentSellerId,
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setErrors([]);
                getSellers(token);
                setSuccessMsg(response.data.message);
                setShowDeletePopUp(false);
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    setSuccessMsg('')
                }, 2000);
            } else {
                setLoading(false);
                setErrors(response.data.errors);
                TimerMixin.setTimeout(() => {
                    setErrors([]);
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.error(error);
        }
    }

    const handleSearch = async (search, token) => {
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/admin/search-seller`, {
                api_password: 'Fentec@scooters.algaria',
                search: search,
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setLoading(false);
                setErrors([]);
                setSellers(response.data.data);
            } else {
                setLoading(false);
                setErrors(response.data.errors);
                TimerMixin.setTimeout(() => {
                    setErrors([]);
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.error(error);
        }
    }

    const [search, setSearch] = useState("");

    const [searchFocused, setSarchFocused] = useState(false);
    const handleSearchFocus = () => {
        setSarchFocused(true);
    };

    const showScreens = (user, token) => {
        if (!user) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } else {
            getSellers(token).then(() => {
                setLoading(false)
            })
        }
    }

    useEffect(() => {

        getStoredToken().then((res) => {
            let token = res
            if (token) {
                setToken(token)
                getUser(token).then((user) => {
                    showScreens(user, token)
                })
            } else {
                showScreens(res)
            }
        });

    }, []);

    return (
        <SafeAreaView style={[styles.wrapper]}>
            <BackgroundImage></BackgroundImage>
            <Text style={{
                position: 'absolute', top: 50, right: 20, color: "#fff",
                padding: 1 * 16,
                marginLeft: 10,
                fontSize: 1 * 16,
                backgroundColor: '#e41749',
                fontFamily: 'Outfit_600SemiBold',
                borderRadius: 1.25 * 16,
                zIndex: 9999999999,
                display: errors.length ? 'flex' : 'none'
            }}>{errors.length ? errors[0] : ''}</Text>
            <Text style={{
                position: 'absolute', top: 50, right: 20, color: "#fff",
                padding: 1 * 16,
                marginLeft: 10,
                fontSize: 1 * 16,
                backgroundColor: '#12c99b',
                fontFamily: 'Outfit_600SemiBold',
                borderRadius: 1.25 * 16,
                zIndex: 9999999999,
                display: successMsg == '' ? 'none' : 'flex'
            }}>{successMsg}</Text>
            {loading && (
                <View style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 9999999999,
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginTop: 22,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: 10,
                    left: 0,
                }}>
                    <ActivityIndicator size="200px" color="#ff7300" />
                </View>
            )}
            <ScrollView>
                <View style={styles.container}>
                    {user && (
                        <Text style={styles.title}>Hello, {user.full_name}</Text>
                    )}
                    <TouchableOpacity onPress={() => {navigation.push('History')}}><Text style={{
                        color: 'rgba(255, 115, 0, 1)',
                        fontFamily: "Outfit_700Bold",
                        textAlign: 'center',
                        fontSize: 14,
                        marginTop: 16
                    }}>Transactions History</Text></TouchableOpacity>
                    <View style={styles.table_wrapper}>
                        <View style={styles.table_head}>
                            <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Register', params: { token: token } }] })}><Text style={styles.add_btn}>Add Seller</Text></TouchableOpacity>
                            <TextInput
                                placeholder={"Search for seller"}
                                onChangeText={setSearch}
                                value={search}
                                onFocus={() => handleSearchFocus()}
                                onBlur={() => setSarchFocused(false)}
                                onKeyPress={() => handleSearch(search, token)}
                                style={[
                                    styles.input,
                                    searchFocused && {
                                        borderColor: 'rgba(255, 115, 0, 1)',
                                        borderWidth: 2
                                    },
                                ]}

                            />
                        </View>
                        <View style={styles.table}>
                            <View style={styles.thead}>
                                <View style={styles.tr}>
                                    <View style={styles.th}><Text style={styles.th_text}>Seller Name</Text></View>
                                    <View style={styles.th}><Text style={styles.th_text}>Unbilled points</Text></View>
                                </View>
                            </View>
                            {sellers.length === 0 &&
                                (
                                    <View>
                                        <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 18, textAlign: 'center' }}>{search ? "No results" : "There are no sellers yet."}</Text>
                                    </View>
                                )}

                            {
                                sellers.length > 0 &&
                                (
                                    <View style={styles.tbody}>
                                        {sellers.map((seller) => (
                                            <View style={styles.tr} key={seller.id}>
                                                <View style={[styles.td, styles.td_text_first]}>
                                                    <Text style={styles.td_text}>{seller.name}</Text>
                                                    <View style={{ flexDirection: 'row', gap: 5, marginTop: 5 }}>
                                                        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Register', params: { token: token, seller: seller } }] })} style={{ padding: 8, backgroundColor: '#13DEB9', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}><FontAwesome name="edit" size={22} color="white" /></TouchableOpacity>
                                                        <TouchableOpacity onPress={() => { handleShowDeletePopUp(seller.id, seller.name) }} style={{ padding: 8, backgroundColor: '#FA896B', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}><AntDesign name="deleteuser" size={22} color="white" /></TouchableOpacity>
                                                        <TouchableOpacity onPress={() => { handleShowReloadPopUp(seller.id, seller.name) }} style={{ padding: 8, backgroundColor: '#49BEFF', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}><Ionicons name="reload" size={22} color="white" /></TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View style={[styles.td, { justifyContent: 'center', alignItems: 'center' }]}>
                                                    <Text style={styles.td_text}>{seller.unbilled_points}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )
                            }
                        </View>
                    </View>
                </View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={showReloadPopUp}
                >

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{ fontFamily: "Outfit_600SemiBold", fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
                                هل ان متاكد من اعادة نقاط {currentSellerName} الي الصفر
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'end', gap: 20, }}>
                                <TouchableOpacity onPress={() => setShowReloadPopUp(false)} style={{ backgroundColor: '#c2c2c2', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center' }}>
                                    <Text>الغاء</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleReload(token)} style={{ backgroundColor: '#ff7300', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center', color: '#fff' }}>
                                    <Text style={{ color: '#fff' }}>اعادة</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={showDeletePopUp}
                >

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{ fontFamily: "Outfit_600SemiBold", fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
                                هل ان متاكد من حذف حساب {currentSellerName} نهائيا
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'end', gap: 20, }}>
                                <TouchableOpacity onPress={() => setShowDeletePopUp(false)} style={{ backgroundColor: '#c2c2c2', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center' }}>
                                    <Text>الغاء</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(token)} style={{ backgroundColor: '#FA896B', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center', color: '#fff' }}>
                                    <Text style={{ color: '#fff' }}>حذف</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginTop: 70
    },
    contianer: {
        padding: '1.25rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        zIndex: 3,
        gap: 10,
        paddingBottom: 160
    },
    title: {
        fontSize: 1.25 * 16,
        fontFamily: 'Outfit_600SemiBold',
        lineHeight: 1.5 * 16,
        textAlign: 'center',
        marginTop: 90
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, .5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    approvingAlert: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ab002b",
        backgroundColor: '#e41749',
        width: '90%',
        fontFamily: 'Outfit_400Regular',
        color: '#fff',
        fontSize: 16
    },
    profile: {
        // padding: 16,
        paddingTop: 16,
        paddingBottom: 16,
        width: '90%',
        gap: 1.25 * 16,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 100
    },
    head: {
        alignItems: "center",
        justifyContent: "center",
        gap: 16
    },
    profile_img: {
        width: 16 * 7,
        height: 16 * 7,
        borderRadius: 8 * 7,
        resizeMode: "cover"
    },
    name: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 22,
        textAlign: 'center'
    },
    details: {
        width: '100%',
        flexDirection: "row",
        justifyContent: 'center',
        gap: 1.25 * 16
    },
    trips: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        color: 'black',
        width: '40%',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        gap: 10
    },
    trips_text: {
        fontSize: 1.25 * 16,
        fontFamily: 'Outfit_400Regular',
        textAlign: 'center',
    },
    bg: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        height: "85%",
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    contianer_bg: {
        width: '90%',
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
        gap: 10
    },
    navigate_Text: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        textAlign: 'center',
        margin: 5,
        color: 'rgba(255, 115, 0, 1)'
    },
    btn: {
        paddingTop: 16,
        paddingBottom: 18,
        borderRadius: 1.25 * 16,
        backdropFilter: "blur(1)",
        width: "90%",
        backgroundColor: "#ff7300",
        transition: "all .3s ease-in",
        border: "3 solid #ff7300",
        // marginBottom: 1.25 * 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button_text: {
        color: "#fff",
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        textAlign: "center",
    },
    how_container: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20
    },
    how_element: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 14,
        marginBottom: 10,
        marginTop: 10,
        gap: 10,
        width: '48%'
    },
    table_head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%",
        alignItems: 'center'
    },
    input: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
        lineHeight: 1.2 * 16,
        textAlign: 'left',
        padding: 10,
        paddingLeft: 15,
        borderRadius: 16,
        backgroundColor: "#fff",
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: 180,
    },
    add_btn: {
        fontSize: 16,
        lineHeight: 1.2 * 16,
        textAlign: 'left',
        padding: 10,
        paddingLeft: 15,
        borderRadius: 16,
        backgroundColor: "#fff",
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        fontFamily: 'Outfit_600SemiBold',
        backgroundColor: 'rgba(255, 115, 0, 1)',
        color: '#fff',
        borderRadius: 10
    },
    table_wrapper: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    table: {
        width: "100%",
        gap: 16
    },
    thead: {
        padding: 10,
        paddingBottom: 0,
        gap: 10,
        marginTop: 15
    },
    tr: {
        flexDirection: "row",
        gap: 10,
        justifyContent: 'space-between',
        borderBlockColor: '#d5dfe4',
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    th: {
        width: 'auto'
    },
    th_text: {
        fontSize: 15,
        fontFamily: 'Outfit_600SemiBold',
    },
    tbody: {
        padding: 10,
        gap: 10,
    },
    td: {
        width: 'auto'
    },
    td_text: {
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
        width: '100%'
    },
    td_text_first: {
        width: 200,
    }
});
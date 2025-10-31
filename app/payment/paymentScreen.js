import CheckerCC, * as cardValidator from 'card-validator';
import { useNavigation } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CreditCard from 'react-native-credit-card-ui';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MyStatusBar from "../../components/myStatusBar";
import {
  Colors,
  commonStyles,
  Fonts,
  screenWidth,
  Sizes,
} from "../../constants/styles";

const PaymentScreen = () => {

  const navigation = useNavigation();

  const [expiry, setExpiry] = useState('');
  const [holder, setHolder] = useState('');
  const [number, setNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [focusCvv, setFocusCvv] = useState(false);
  const [backspaceRemove, setBackspaceRemove] = useState(false);
  const [isValidHolder, setIsValidHolder] = useState('');
  const [cardType, setCardType] = useState('');
  const [expiryInfo, setExpiryInfo] = useState({});
  const [saveCard, setsaveCard] = useState(true);
  const [isValidNumber, setIsValidNumber] = useState(true);

  const getCardType = (number) => {
    const visaRegEx = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardRegEx = /^5[1-5][0-9]{14}$/;
    const amexRegEx = /^3[47][0-9]{13}$/;
    const discoverRegEx = /^6(?:011|5[0-9]{2})[0-9]{12}$/;

    if (visaRegEx.test(number)) return "visa";
    if (mastercardRegEx.test(number)) return "mastercard";
    if (amexRegEx.test(number)) return "amex";
    if (discoverRegEx.test(number)) return "discover";
    return "mastercard";
  };

  const handleCardNumberChange = (value) => {
    let formattedText = value.split(" ").join("");
    if (formattedText.length > 0) {
      formattedText = formattedText.match(new RegExp(".{1,4}", "g")).join(" ");
    }
    setCardType(getCardType(value));
    if (formattedText.length === 19) {
      var numberValidation = cardValidator.number(value);
      setIsValidNumber(numberValidation.isValid);
    } else {
      setIsValidNumber(false);
    }
    setNumber(formattedText);
  };

  const formattedNumber = number.replace(/\s/g, "");

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
        >
          {paymentDescriptionText()}
          {cardView()}
          {cardNumberInfo()}
          {cardHolderInfo()}
          {expiryAndCvvInfo()}
          {saveCardInfo()}
        </ScrollView>
        {payButton()}
      </View>
    </View>
  );

  function expiryAndCvvInfo() {
    const handleExpiryDate = (text) => {
      let textTemp = text;
      if (textTemp.length === 2) {
        if (
          parseInt(textTemp.substring(0, 2)) > 12 ||
          parseInt(textTemp.substring(0, 2)) === 0
        ) {
          textTemp = textTemp[0];
        } else if (text.length === 2 && !backspaceRemove) {
          textTemp += '/';
          setBackspaceRemove(true);
        } else if (text.length === 2 && backspaceRemove) {
          textTemp = textTemp[0];
          setBackspaceRemove(false);
        }
      }
      setExpiry(textTemp);
    };
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding }}>
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.blackColor18SemiBold, marginBottom: Sizes.fixPadding - 5.0 }}>
            Expiry
          </Text>
          <View style={styles.textFieldWrapper}>
            <TextInput
              placeholder="MM/YY"
              placeholderTextColor={Colors.grayColor}
              value={expiry}
              onChangeText={(value) => {
                handleExpiryDate(value);
                const expiryValidation = CheckerCC.expirationDate(value);
                setExpiryInfo(expiryValidation);
              }}
              style={{ padding: 0, ...Fonts.blackColor16Medium, color: !expiryInfo.isValid ? 'red' : Colors.blackColor }}
              maxLength={5}
              keyboardType="numeric"
              cursorColor={Colors.primaryColor}
              selectionColor={Colors.primaryColor}
              numberOfLines={1}
            />
          </View>
        </View>
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.blackColor18SemiBold, marginBottom: Sizes.fixPadding - 5.0 }}>
            CVV/CVC
          </Text>
          <View style={styles.textFieldWrapper}>
            <TextInput
              placeholder="CVV/CVC"
              placeholderTextColor={Colors.grayColor}
              value={cvv}
              onChangeText={(value) => setCvv(value)}
              style={{ padding: 0, ...Fonts.blackColor16Medium }}
              maxLength={3}
              keyboardType="numeric"
              onFocus={() => { setFocusCvv(true) }}
              onBlur={() => { setFocusCvv(false) }}
              cursorColor={Colors.primaryColor}
              selectionColor={Colors.primaryColor}
              numberOfLines={1}
            />
          </View>
        </View>
      </View>
    )
  }

  function cardHolderInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor18SemiBold, marginBottom: Sizes.fixPadding - 5.0 }}>
          Card Holder Name
        </Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Card Holder Name"
            placeholderTextColor={Colors.grayColor}
            value={holder}
            onChangeText={(value) => {
              setHolder(value)
              const holderValidation = CheckerCC.cardholderName(value);
              setIsValidHolder(holderValidation.isValid);
            }}
            style={{ padding: 0, ...Fonts.blackColor16Medium, color: isValidHolder ? Colors.blackColor : 'red' }}
            maxLength={26}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            numberOfLines={1}
          />
        </View>
      </View>
    )
  }

  function cardNumberInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor18SemiBold, marginBottom: Sizes.fixPadding - 5.0 }}>
          Card Number
        </Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Card Number"
            placeholderTextColor={Colors.grayColor}
            value={number}
            onChangeText={(value) => { handleCardNumberChange(value) }}
            style={{ padding: 0, ...Fonts.blackColor16Medium, color: cardType ? Colors.blackColor : 'red' }}
            keyboardType="numeric"
            maxLength={19}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            numberOfLines={1}
          />
        </View>
      </View>
    )
  }

  function cardView() {
    return (
      <CreditCard
        shiny
        bar={true}
        focused={focusCvv ? 'cvc' : null}
        number={formattedNumber}
        name={holder}
        expiry={expiry}
        cvc={cvv}
        bgColor={Colors.primaryColor}
        imageFront={require('../../assets/images/cardbg.png')}
        imageBack={require('../../assets/images/cardbg.png')}
        style={{ alignSelf: 'center', marginBottom: Sizes.fixPadding * 2.0 }}
        type={cardType}
        width={screenWidth - 40}
        height={220}
      />
    );
  }

  function payButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { navigation.push("PropertyForm/PropertyForm") }}
        style={{ ...commonStyles.button, borderRadius: 0 }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Pay</Text>
      </TouchableOpacity>
    );
  }

  function saveCardInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setsaveCard(!saveCard)}
        style={styles.saveCardInfoWrapper}
      >
        <View
          style={{
            ...styles.selectionIndicatorStyle,
            backgroundColor: saveCard ? Colors.primaryColor : Colors.whiteColor,
            ...commonStyles.shadow,
          }}
        >
          {saveCard ? (
            <MaterialIcons name="check" color={Colors.whiteColor} size={18} />
          ) : null}
        </View>
        <Text
          style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}
        >
          Save this card
        </Text>
      </TouchableOpacity>
    );
  }

  function paymentDescriptionText() {
    return (
      <Text
        style={{
          ...Fonts.grayColor16Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding + 5.0,
        }}
      >
        Enter your card detail and pay..
      </Text>
    );
  }

  function header() {
    return (
      <View
        style={{
          ...commonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={26}
          onPress={() => { navigation.pop() }}
        />
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding * 2.0,
          }}
        >
          Pay now
        </Text>
      </View>
    );
  }
};

export default PaymentScreen;

const styles = StyleSheet.create({
  selectionIndicatorStyle: {
    width: 24.0,
    height: 24.0,
    borderRadius: 12.0,
    alignItems: "center",
    justifyContent: "center",
  },
  saveCardInfoWrapper: {
    ...commonStyles.rowAlignCenter,
    margin: Sizes.fixPadding * 2.0,
    alignSelf: "flex-start",
  },
  textFieldWrapper: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    ...commonStyles.shadow,
    padding: Sizes.fixPadding,
  }
});

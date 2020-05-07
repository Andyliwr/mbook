const numbers = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  一: 1,
  兩: 2,
  两: 2,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  零: 0,
  〇: 0,
  十: 10
}

// 浮点部分转换
const float2numstring = chiNumber => {
  return chiNumber
    .split('')
    .map(digit => numbers[digit] + '')
    .join('')
}

// 整数部分转换
const int2num = chiNumber => {
  let stack = []
  const separateUnits = {
    萬: 10000,
    億: 10000,
    万: 10000,
    亿: 10000
  }
  const units = {
    仟: 1000,
    千: 1000,
    百: 100,
    十: 10
  }

  if (chiNumber.length === 1) {
    return numbers[chiNumber]
  }

  let total = 0
  for (let i = 0; i < chiNumber.length; i++) {
    const current = chiNumber[i]
    if (current in units) {
      total += units[current] * (stack.pop() || 1)
      stack = []
    } else if (current in separateUnits) {
      const times = current.match(/亿|億/) && !chiNumber.substr(i).match(/万|萬/) ? 100000000 : 10000
      total *= times
      total += times * (stack.pop() || 0)
      stack = []
    } else {
      if (!numbers[current]) {
        if (numbers[current] === 0) {
          stack.push(0)
        } else {
          stack.push(current)
        }
      } else {
        stack.push(numbers[current])
      }
    }
  }

  if (total) {
    if (stack.length > 0) {
      total += Number(stack.join(''))
    }
    return total
  } else {
    return Number(chiNumber)
  }
}

// 正数转换
const postiveChinese2number = chiNumber => {
  if (chiNumber.match('点')) {
    const integerPart = chiNumber.split('点')[0]
    const floatPart = chiNumber.split('点')[1]
    return +(int2num(integerPart) + '.' + float2numstring(floatPart))
  } else return int2num(chiNumber)
}

const chinese2number = chiNumber => {
  if (!chiNumber) return 0

  if (chiNumber.match(/^负/)) {
    return -postiveChinese2number(chiNumber.replace('负', ''))
  } else return postiveChinese2number(chiNumber.replace('负', ''))
}

module.exports = chinese2number

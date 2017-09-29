# -*-coding: utf-8*-
import re
str1 = "同花顺(300033)"
print(re.search(r"\w+", str1).group())
print(re.search(r'\((.*?)\)', str1).groups()[0])
